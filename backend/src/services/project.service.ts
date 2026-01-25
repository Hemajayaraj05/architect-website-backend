import cloudinary from "../config/cloudinary.config";
import { pool } from "../config/db";

// Create a project
export const createProject = async (
  title: string,
  location: string,
  folder: string
) => {
  const result = await pool.query(
    `INSERT INTO projects (title, location, cloudinary_folder)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [title, location, folder]
  );

  return result.rows[0];
};

// Upload multiple images for a project
export const uploadProjectImages = async (
  projectId: number,
  files: Express.Multer.File[],
  folder: string
) => {
  const uploadedImages = [];

  for (const file of files) {
    const upload = await cloudinary.uploader.upload(file.path, { folder });

   const result = await pool.query(
  `INSERT INTO project_images (project_id, public_id, secure_url)
   VALUES ($1, $2, $3)
   RETURNING id`,
  [projectId, upload.public_id, upload.secure_url]
);

uploadedImages.push({
  id: result.rows[0].id,   
  publicId: upload.public_id,
  url: upload.secure_url,
});

  }

  return uploadedImages;
};


// Get all projects with images
export const getAllProjectsWithImages = async () => {
  const result = await pool.query(`
    SELECT 
      p.id,
      p.title,
      p.location,
      COALESCE(
        json_agg(
          json_build_object(
            'id', i.id,
            'url', i.secure_url,
            'publicId', i.public_id
          )
          ORDER BY i.created_at
        ) FILTER (WHERE i.id IS NOT NULL),
        '[]'
      ) AS images
    FROM projects p
    LEFT JOIN project_images i ON p.id = i.project_id
    GROUP BY p.id
    ORDER BY p.created_at DESC
  `);

  return result.rows;
};

export const deleteProjectImage = async (imageId: number) => {
  const result = await pool.query(
    `SELECT public_id FROM project_images WHERE id = $1`,
    [imageId]
  );

  if (!result.rows.length) return;

  const { public_id } = result.rows[0];

  await cloudinary.uploader.destroy(public_id);

  await pool.query(
    `DELETE FROM project_images WHERE id = $1`,
    [imageId]
  );
};
export const getProjectFolder = async (projectId: number) => {
  const result = await pool.query(
    `SELECT cloudinary_folder FROM projects WHERE id = $1`,
    [projectId]
  );
  return result.rows[0]?.cloudinary_folder;
};
export const createProjectWithFolder = async (
  title: string,
  location: string
) => {
  
  const result = await pool.query(
    `INSERT INTO projects (title, location)
     VALUES ($1, $2)
     RETURNING id, title, location`,
    [title, location]
  );

  const projectId = result.rows[0].id;
  const folder = `projects/project_${projectId}`;

  
  const updated = await pool.query(
    `UPDATE projects
     SET cloudinary_folder = $1
     WHERE id = $2
     RETURNING *`,
    [folder, projectId]
  );

  return updated.rows[0];
};

