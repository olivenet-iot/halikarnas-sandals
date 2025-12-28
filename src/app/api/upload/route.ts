import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { slugify } from "@/lib/utils";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    // Auth check - only admin can upload
    const session = await auth();
    if (
      !session?.user ||
      (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")
    ) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    // Folder and naming parameters
    const folder = (formData.get("folder") as string) || "halikarnas/products";
    const gender = formData.get("gender") as string;
    const category = formData.get("category") as string;
    const productSlug = formData.get("productSlug") as string;
    const sku = formData.get("sku") as string;
    const color = formData.get("color") as string;
    const imageIndex = (formData.get("imageIndex") as string) || "1";

    // Debug: Log all received parameters
    console.log("📦 Upload params received:", {
      folder,
      gender: gender || "(empty)",
      category: category || "(empty)",
      productSlug: productSlug || "(empty)",
      sku: sku || "(empty)",
      color: color || "(empty)",
      imageIndex,
    });

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, error: "Only image files are allowed" },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: "File size must be less than 5MB" },
        { status: 400 }
      );
    }

    // Convert file to buffer then to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const dataURI = `data:${file.type};base64,${base64}`;

    // Build folder path: halikarnas/products/kadin/bodrum-sandalet
    let folderPath = folder;
    if (gender && gender.trim() !== "") {
      folderPath += `/${gender.toLowerCase().trim()}`;
    }
    if (category && category.trim() !== "") {
      folderPath += `/${slugify(category)}`;
    }

    console.log("📁 Final folder path:", folderPath);

    // Build file name: 100-mavi-sandalet-siyah-1
    let fileName = "";
    if (sku) {
      fileName += sku;
    }
    if (productSlug) {
      fileName += fileName ? `-${slugify(productSlug)}` : slugify(productSlug);
    }
    if (color) {
      fileName += `-${slugify(color)}`;
    }
    fileName += `-${imageIndex}`;

    // Fallback if no name parts provided
    if (fileName === `-${imageIndex}`) {
      fileName = `img-${Date.now()}-${imageIndex}`;
    }

    // Upload to Cloudinary
    const uploadOptions: Record<string, unknown> = {
      folder: folderPath,
      resource_type: "auto",
      transformation: [{ quality: "auto:good" }, { fetch_format: "auto" }],
    };

    // Only set public_id if we have a proper file name
    if (fileName && !fileName.startsWith("img-")) {
      uploadOptions.public_id = fileName;
      uploadOptions.overwrite = true;
    }

    const result = await cloudinary.uploader.upload(dataURI, uploadOptions);

    console.log("✅ Upload success:", {
      publicId: result.public_id,
      folder: result.folder || folderPath,
      url: result.secure_url,
    });

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      folder: folderPath,
      fileName: fileName,
      width: result.width,
      height: result.height,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: "Upload failed" },
      { status: 500 }
    );
  }
}
