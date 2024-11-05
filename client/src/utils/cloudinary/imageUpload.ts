import axios from "axios";

export const ImageUpload = async (file: File) => {
  const presetKey = "hqds71um";
  const cloudName = "dpsdh1cq9";

  if (!presetKey || !cloudName) {
    console.error("Cloudinary preset key or cloud name is missing");
    return null;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", presetKey);

  try {
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, 
      formData
    );
    const { secure_url } = res.data;

    console.log(secure_url, "secure url");
    console.log(res.data, "resp data");

    console.log(secure_url,"secure url");

    return secure_url; //* Return the secure URL of the uploaded image
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
};
