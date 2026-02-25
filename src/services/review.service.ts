import { supabase } from "../config/supabase";

interface ReviewData {
  project_name: string;
  client_name: string;
  place: string;
  review: string;
  stars: number;
}

export const createReview = async (data: ReviewData) => {
  const { data: review, error } = await supabase
    .from("reviews")
    .insert([data])
    .select()
    .single();

  if (error) throw error;

  return review;
};

export const getAllReviews = async () => {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
};

export const getReviewById = async (id: number) => {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
};

export const updateReview = async (id: number, data: ReviewData) => {
  const { data: review, error } = await supabase
    .from("reviews")
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return review;
};

export const deleteReview = async (id: number) => {
  const { error } = await supabase.from("reviews").delete().eq("id", id);

  if (error) throw error;
};
