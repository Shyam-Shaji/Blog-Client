import axiosInstance from "@/api/axios";

export const updateUserAPI = async (data: any) => {
  const formData = new FormData();
  
  if (data.username) formData.append("username", data.username);
  if (data.email) formData.append("email", data.email);
  if (data.firstName) formData.append("first_name", data.firstName);
  if (data.lastName) formData.append("last_name", data.lastName);
  if (data.bio) formData.append("bio", data.bio);
  if (data.profilePicture) formData.append("profile_picture", data.profilePicture);
  if (data.coverPicture) formData.append("cover_picture", data.coverPicture);
  
  // Add social links if they exist
  ["website", "facebook", "instagram", "linkedin", "x", "youtube"].forEach(key => {
    if (data[key]) formData.append(key, data[key]);
  });

  const res = await axiosInstance.put(`/users/current`, formData);
  return res.data;
}