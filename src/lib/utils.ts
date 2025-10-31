import imageCompression from 'browser-image-compression';
export function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    console.log("file: ", file.type);

    if (file.type === 'image/svg+xml') {
      // Read SVG as text and encode it to Base64
      file.text()
        .then(svgText => {
          const base64Svg = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgText)))}`;
          resolve(base64Svg);
        })
        .catch(reject);
    } else if (file.type.startsWith('image/')) {
      // For other image types, use readAsDataURL to directly get Base64
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    } else {
      reject(new Error('Unsupported file type'));
    }
  });
}

// convert any file to webp using sharp
export async function convertFileToWebP(file: File): Promise<File | undefined> {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: 'image/webp', // output type
  };

  let webpFile;
  try {
    webpFile = await imageCompression(file, options);

    return webpFile;

  } catch (error) {
    console.error('Image compression error:', error);
    return undefined;
  }
}

type FormData = {
  name: string;
  created_at: string;
  email?: string;
  contact_number: string;
  desired_position?: string;
  linkedin_link?: string;
  portfolio_link?: string;
  resume?: string;
  nameof_society?: string;
  nameof_company?: string;
  company_email?: string;
  advertisement_type?: string;
  message: string;
};

export function generateApplicationEmailTemplate(type: string, data: FormData) {
  switch (type) {
    case "career_forms":
      return `
        <div>
          <h2>New Career Application - ${new Date().toLocaleDateString()}</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Date:</strong> ${new Date(data.created_at).toLocaleDateString()}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Contact Number:</strong> ${data.contact_number}</p>
          <p><strong>Position Applied:</strong> ${data.desired_position}</p>
          <p><strong>LinkedIn:</strong> <a href="${data.linkedin_link}">${data.linkedin_link}</a></p>
          <p><strong>Portfolio:</strong> <a href="${data.portfolio_link}">${data.portfolio_link}</a></p>
          <p><strong>Resume:</strong> <a href="${data.resume}" download>Download Resume</a></p>
          <p><strong>Message:</strong> ${data.message}</p>
        </div>
      `;

    case "residential_forms":
      return `
        <div>
          <h2>New Residential Application - ${new Date().toLocaleDateString()}</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Date:</strong> ${new Date(data.created_at).toLocaleDateString()}</p>
          <p><strong>Society Name:</strong> ${data.nameof_society}</p>
          <p><strong>Contact Number:</strong> ${data.contact_number}</p>
          <p><strong>Message:</strong> ${data.message}</p>
        </div>
      `;

    case "corporate_forms":
      return `
        <div>
          <h2>New Corporate Application - ${new Date().toLocaleDateString()}</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Date:</strong> ${new Date(data.created_at).toLocaleDateString()}</p>
          <p><strong>Company Name:</strong> ${data.nameof_company}</p>
          <p><strong>Company Email:</strong> ${data.company_email}</p>
          <p><strong>Contact Number:</strong> ${data.contact_number}</p>
          <p><strong>Message:</strong> ${data.message}</p>
        </div>
      `;

    case "advertisement_forms":
      return `
        <div>
          <h2>New Advertisement Application - ${new Date().toLocaleDateString()}</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Date:</strong> ${new Date(data.created_at).toLocaleDateString()}</p>
          <p><strong>Company Name:</strong> ${data.nameof_company}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Contact Number:</strong> ${data.contact_number}</p>
          <p><strong>Advertisement Type:</strong> ${data.advertisement_type}</p>
          <p><strong>Message:</strong> ${data.message}</p>
        </div>
      `;

    default:
      return `<p>Error: Unknown form type</p>`;
  }
}
