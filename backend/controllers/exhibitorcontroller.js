import ExhibitorProfile from "../models/ExhibitorProfile.js";
import { v2 as cloudinary } from "cloudinary";

// =====================================================
// CLOUDINARY CONFIG
// =====================================================

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// =====================================================
// CHECK CLOUDINARY CONFIG
// =====================================================

const checkCloudinaryConfig = () => {
  const missing = [];

  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    missing.push("CLOUDINARY_CLOUD_NAME");
  }

  if (!process.env.CLOUDINARY_API_KEY) {
    missing.push("CLOUDINARY_API_KEY");
  }

  if (!process.env.CLOUDINARY_API_SECRET) {
    missing.push("CLOUDINARY_API_SECRET");
  }

  if (missing.length > 0) {
    throw new Error(
      `Cloudinary environment variables missing: ${missing.join(", ")}`
    );
  }
};

// =====================================================
// UPLOAD BUFFER TO CLOUDINARY
// =====================================================

const uploadToCloudinary = (
  fileBuffer,
  mimetype,
  originalName = ""
) => {
  return new Promise((resolve, reject) => {
    if (!fileBuffer) {
      return reject(new Error("File buffer is empty."));
    }

    const isPdf =
      mimetype === "application/pdf" ||
      /\.pdf$/i.test(originalName);

    const uploadOptions = {
      folder: "eventsphere/exhibitor_assets",
      resource_type: isPdf ? "raw" : "image",
      use_filename: true,
      unique_filename: true,
      overwrite: false,
    };

    if (!isPdf) {
      uploadOptions.quality = "auto";
      uploadOptions.fetch_format = "auto";
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error(
            "❌ Cloudinary Upload Error:",
            error
          );

          return reject(error);
        }

        if (!result || !result.secure_url) {
          return reject(
            new Error(
              "Cloudinary did not return a secure URL."
            )
          );
        }

        console.log(
          "✅ Cloudinary Upload:",
          result.secure_url
        );

        resolve(result.secure_url);
      }
    );

    uploadStream.end(fileBuffer);
  });
};

// =====================================================
// UPDATE EXHIBITOR PROFILE
// =====================================================

export const updateExhibitorProfile = async (req, res) => {
  try {
    console.log("");
    console.log("====================================");
    console.log("📥 EXHIBITOR PROFILE UPDATE REQUEST");
    console.log("====================================");

    // -------------------------------------------------
    // USER ID
    // -------------------------------------------------

    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID missing",
      });
    }

    console.log("👤 User ID:", userId);

    // -------------------------------------------------
    // FILES
    // -------------------------------------------------

    const files = req.files || {};

    console.log(
      "📦 Files received:",
      Object.keys(files)
    );

    console.log(
      "📦 Logo files:",
      files.logo?.length || 0
    );

    console.log(
      "📦 Product files:",
      files.productImages?.length || 0
    );

    console.log(
      "📦 Document files:",
      files.documents?.length || 0
    );

    // -------------------------------------------------
    // CLOUDINARY CHECK
    // Only required if files are being uploaded
    // -------------------------------------------------

    const hasFiles =
      (files.logo?.length || 0) > 0 ||
      (files.productImages?.length || 0) > 0 ||
      (files.documents?.length || 0) > 0;

    if (hasFiles) {
      checkCloudinaryConfig();
      console.log("☁️ Cloudinary configuration OK");
    }

    // -------------------------------------------------
    // EXISTING PROFILE
    // -------------------------------------------------

    const existingProfile =
      await ExhibitorProfile.findOne({
        userId,
      });

    console.log(
      "📄 Existing profile:",
      !!existingProfile
    );

    // -------------------------------------------------
    // EXISTING PRODUCTS
    // -------------------------------------------------

    let existingProducts = [];

    try {
      if (req.body.existingProducts) {
        existingProducts = JSON.parse(
          req.body.existingProducts
        );
      }
    } catch (error) {
      console.error(
        "❌ Existing products JSON error:",
        error
      );

      existingProducts = [];
    }

    if (!Array.isArray(existingProducts)) {
      existingProducts = [];
    }

    // -------------------------------------------------
    // EXISTING DOCUMENTS
    // -------------------------------------------------

    let existingDocs = [];

    try {
      if (req.body.existingDocuments) {
        existingDocs = JSON.parse(
          req.body.existingDocuments
        );
      }
    } catch (error) {
      console.error(
        "❌ Existing documents JSON error:",
        error
      );

      existingDocs = [];
    }

    if (!Array.isArray(existingDocs)) {
      existingDocs = [];
    }

    // -------------------------------------------------
    // PRODUCT NAMES
    // -------------------------------------------------

    let productNames = req.body.productNames;

    if (!productNames) {
      productNames = [];
    } else if (!Array.isArray(productNames)) {
      productNames = [productNames];
    }

    console.log(
      "🛍 Product names:",
      productNames
    );

    // -------------------------------------------------
    // UPDATE DATA
    // -------------------------------------------------

    const updateData = {
      companyName: req.body.companyName || "",
      industry: req.body.industry || "",
      description: req.body.description || "",
      contactPhone: req.body.contactPhone || "",

      productShowcase: existingProducts,

      documents: existingDocs,

      logo: existingProfile?.logo || "",
    };

    // =================================================
    // LOGO
    // =================================================

    if (
      files.logo &&
      files.logo.length > 0
    ) {
      const logoFile = files.logo[0];

      console.log(
        "🖼 Uploading logo:",
        logoFile.originalname,
        logoFile.mimetype,
        logoFile.size
      );

      updateData.logo =
        await uploadToCloudinary(
          logoFile.buffer,
          logoFile.mimetype,
          logoFile.originalname
        );

      console.log(
        "✅ Logo URL:",
        updateData.logo
      );
    }

    // =================================================
    // PRODUCT IMAGES
    // =================================================

    if (
      files.productImages &&
      Array.isArray(files.productImages) &&
      files.productImages.length > 0
    ) {
      console.log(
        "🛍 Product image count:",
        files.productImages.length
      );

      const newProducts =
        await Promise.all(
          files.productImages.map(
            async (file, index) => {
              console.log(
                `🖼 Uploading product ${index + 1}:`,
                file.originalname,
                file.mimetype,
                file.size
              );

              const imageUrl =
                await uploadToCloudinary(
                  file.buffer,
                  file.mimetype,
                  file.originalname
                );

              return {
                name:
                  productNames[index] ||
                  "Product",

                image: imageUrl,
              };
            }
          )
        );

      updateData.productShowcase = [
        ...existingProducts,
        ...newProducts,
      ];

      console.log(
        "✅ Products uploaded:",
        newProducts
      );
    }

    // =================================================
    // DOCUMENTS
    // =================================================

    if (
      files.documents &&
      Array.isArray(files.documents) &&
      files.documents.length > 0
    ) {
      console.log(
        "📄 Document count:",
        files.documents.length
      );

      const newDocuments =
        await Promise.all(
          files.documents.map(
            async (file) => {
              console.log(
                "📄 Uploading document:",
                file.originalname,
                file.mimetype,
                file.size
              );

              return await uploadToCloudinary(
                file.buffer,
                file.mimetype,
                file.originalname
              );
            }
          )
        );

      updateData.documents = [
        ...existingDocs,
        ...newDocuments,
      ];

      console.log(
        "✅ Documents uploaded:",
        newDocuments
      );
    }

    // =================================================
    // DATABASE UPDATE
    // =================================================

    console.log("💾 Saving profile...");

    const profile =
      await ExhibitorProfile.findOneAndUpdate(
        { userId },
        {
          $set: updateData,
        },
        {
          upsert: true,
          new: true,
          runValidators: true,
          setDefaultsOnInsert: true,
        }
      );

    console.log(
      "✅ Profile saved successfully"
    );

    console.log(
      "🖼 Logo:",
      profile.logo
    );

    console.log(
      "🛍 Products:",
      profile.productShowcase
    );

    console.log(
      "📄 Documents:",
      profile.documents
    );

    console.log(
      "===================================="
    );

    return res.status(200).json({
      success: true,
      message:
        "Exhibitor profile updated successfully.",
      profile,
    });
  } catch (error) {
    console.error("");
    console.error(
      "❌❌❌ EXHIBITOR PROFILE SERVER ERROR ❌❌❌"
    );

    console.error(
      "Message:",
      error.message
    );

    console.error(
      "Name:",
      error.name
    );

    console.error(
      "Stack:",
      error.stack
    );

    console.error(
      "===================================="
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Internal Server Error",
    });
  }
};

// =====================================================
// GET MY PROFILE
// =====================================================

export const getMyProfile = async (
  req,
  res
) => {
  try {
    const userId =
      req.user?._id ||
      req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "Unauthorized: User ID missing",
      });
    }

    const profile =
      await ExhibitorProfile.findOne({
        userId,
      });

    return res.status(200).json(
      profile || null
    );
  } catch (error) {
    console.error(
      "❌ Get Profile Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Server error",
    });
  }
};

// =====================================================
// GET ALL EXHIBITORS
// =====================================================

export const getAllExhibitors =
  async (req, res) => {
    try {
      const exhibitors =
        await ExhibitorProfile.find()
          .populate(
            "userId",
            "email"
          );

      return res.status(200).json(
        exhibitors
      );
    } catch (error) {
      console.error(
        "❌ Get All Exhibitors Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Server error while fetching exhibitors",
      });
    }
  };