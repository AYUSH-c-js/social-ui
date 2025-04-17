const uploadfile = async (file) => {
    const data = new FormData();
    data.append("file", file); // Append the file to the FormData object
    data.append("upload_preset", "ayushparmar"); // Replace with your Cloudinary upload preset
    data.append("cloud_name", "dr3mblnzr"); // Replace with your Cloudinary cloud name

    try {
        const response = await fetch("https://api.cloudinary.com/v1_1/dr3mblnzr/image/upload", {
            method: "POST",
            body: data,
        });

        const result = await response.json();
        console.log("File uploaded successfully:", result);
        return result.url; // Return the URL of the uploaded file

    } catch (error) {
        console.error("Error uploading file:", error);
        throw error; // Rethrow the error to handle it in the calling function
    }
};

export default uploadfile;
