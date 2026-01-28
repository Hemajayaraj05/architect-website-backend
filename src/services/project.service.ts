import cloudinary from "../config/cloudinary.config";
import { supabase } from "../config/supabase";
import fs from "fs";

export const createProjectWithFolder = async (title: string, location: string) => {
  const { data, error } = await supabase
    .from("projects")
    .insert([{ title, location }])
    .select("id, title, location")
    .single();

  if (error) throw error;

  const folder = `projects/project_${data.id}`;

  const { data: updated, error: updateError } = await supabase
    .from("projects")
    .update({ cloudinary_folder: folder })
    .eq("id", data.id)
    .select()
    .single();

  if (updateError) throw updateError;
  return updated;
};

export const uploadProjectImages = async (
  projectId: number,
  files: Express.Multer.File[],
  folder: string
) => {
  const uploadedImages = [];

  for (const file of files) {
    const upload = await cloudinary.uploader.upload(file.path, { folder });

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

    uploadedImages.push({
      id: data.id,
      publicId: upload.public_id,
      url: upload.secure_url,
    });

    fs.unlinkSync(file.path);
  }

  return uploadedImages;
};

export const getProjectFolder = async (projectId: number) => {
  const { data, error } = await supabase
    .from("projects")
    .select("cloudinary_folder")
    .eq("id", projectId)
    .single();

  if (error) throw error;
  return data?.cloudinary_folder;
};

export const getAllProjectsWithImages = async () => {
  const { data, error } = await supabase
    .from("projects")
    .select(`
      id,
      title,
      location,
      project_images (
        id,
        secure_url,
        public_id
      )
    `)
    .order("id", { ascending: false });

  if (error) throw error;

  return data.map((p: any) => ({
    id: p.id,
    title: p.title,
    location: p.location,
    images: (p.project_images || []).map((i: any) => ({
      id: i.id,
      url: i.secure_url,
      publicId: i.public_id,
    })),
  }));
};

export const deleteProjectImage = async (imageId: number) => {
  const { data, error } = await supabase
    .from("project_images")
    .select("public_id")
    .eq("id", imageId)
    .single();

  if (error) throw error;

  await cloudinary.uploader.destroy(data.public_id);
  await supabase.from("project_images").delete().eq("id", imageId);
};
