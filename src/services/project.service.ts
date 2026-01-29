import cloudinary from "../config/cloudinary.config";
import { supabase } from "../config/supabase";
import streamifier from "streamifier";

export const createProjectWithFolder = async (title: string, location: string) => {
  const { data, error } = await supabase
    .from("projects")
    .insert([{ title, location }])
    .select()
    .single();

  if (error) throw error;

  const folder = `projects/project_${data.id}`;

  await supabase
    .from("projects")
    .update({ cloudinary_folder: folder })
    .eq("id", data.id);

  return { ...data, cloudinary_folder: folder };
};

const uploadToCloudinary = (
  file: Express.Multer.File,
  folder: string
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

export const uploadProjectImages = async (
  projectId: number,
  files: Express.Multer.File[],
  folder: string
) => {
  const uploaded = [];

  for (const file of files) {
    const upload = await uploadToCloudinary(file, folder);

    const { data, error } = await supabase
      .from("project_images")
      .insert([
        {
          project_id: projectId,
          public_id: upload.public_id,
          secure_url: upload.secure_url,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    uploaded.push({
      id: data.id,
      url: upload.secure_url,
      publicId: upload.public_id,
    });
  }

  return uploaded;
};

export const getProjectFolder = async (projectId: number) => {
  const { data } = await supabase
    .from("projects")
    .select("cloudinary_folder")
    .eq("id", projectId)
    .single();

  return data?.cloudinary_folder;
};

export const getAllProjectsWithImages = async () => {
  const { data } = await supabase.from("projects").select(`
    id,
    title,
    location,
    project_images ( id, secure_url, public_id )
  `);

  return data?.map((p: any) => ({
    id: p.id,
    title: p.title,
    location: p.location,
    images: p.project_images || [],
  }));
};

export const deleteProjectImage = async (imageId: number) => {
  const { data } = await supabase
    .from("project_images")
    .select("public_id")
    .eq("id", imageId)
    .single();

  if (!data) return;

  await cloudinary.uploader.destroy(data.public_id);
  await supabase.from("project_images").delete().eq("id", imageId);
};


export const deleteProjectById = async (projectId: number) => {

  const { data: images } = await supabase
    .from("project_images")
    .select("public_id")
    .eq("project_id", projectId);

 
  if (images?.length) {
    for (const img of images) {
      await cloudinary.uploader.destroy(img.public_id);
    }
  }

  
  await supabase.from("project_images").delete().eq("project_id", projectId);

  
  await supabase.from("projects").delete().eq("id", projectId);
};
