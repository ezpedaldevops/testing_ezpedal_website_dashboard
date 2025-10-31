// import { supabase } from "@/lib/supabase";
import { Application, CareerForm, ResidentialForm, CorporateForm, AdvertisementForm, AllForms } from "@/types";
import { useRouter } from "next/navigation";

interface ApplicationModalProps {
  application: Application | CareerForm | ResidentialForm | CorporateForm | AdvertisementForm | AllForms;
  type: 'career_forms' | 'residential_forms' | 'corporate_forms' | 'advertisement_forms';
  onClose: (id?: number | string) => void;
}

export default function ApplicationModal({
  application,
  type,
  onClose
}: ApplicationModalProps) {
      const router = useRouter();

  const getToken = () => localStorage.getItem("token");

  const handleAuthError = () => {
    localStorage.removeItem("token");
    router.push("/");
  };
  const renderDetails = (type: string) => {
    switch (type) {
      case 'career_forms':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong>Date:</strong> {'created_at' in application ? new Date(application.created_at).toLocaleDateString() : 'N/A'}
                </div>
                <div>
                  <strong>Name:</strong> {application.name}
                </div>
                <div>
                  <strong>Contact Number:</strong> {'contact_number' in application ? application.contact_number : 'N/A'}
                </div>
                <div>
                  <strong>Email ID:</strong> {'email' in application ? application.email : 'N/A'}
                </div>
                {/* download resume */}
                <div>
                  {/* download from base64 string */}
                  <a
                    href={'resume' in application && application.resume ? `${application.resume}` : '#'}
                    download={'resume' in application && application.resume && application.resume && `${application.name}_resume.pdf`}
                    target="_blank"
                    className={`text-blue-500 hover:text-blue-600 ${'resume' in application && application.resume ? '' : 'cursor-not-allowed'}`}
                  >

                    {'resume' in application && application.resume ? 'Download Resume' : 'Resume not available'}
                  </a>
                </div>
                <div>
                  {'linkedin_link' in application && (
                    <div>
                      <strong>LinkedIn Link:</strong> {application.linkedin_link}
                    </div>
                  )}
                </div>
                <div>
                  {'desired_position' in application && (
                    <div>
                      <strong>Position:</strong> {application.desired_position}
                    </div>
                  )}
                </div>
                <div>
                  <strong>Message:</strong> <textarea value={application.message} className="w-full h-24 border rounded p-2" readOnly />
                </div>
              </div>
            </div>
          </div>
        );

      case 'residential_forms':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>Name:</strong> {application.name}
            </div>
            <div>
              <strong>Name of Society:</strong> {'nameof_society' in application ? application.nameof_society : 'N/A'}
            </div>
            <div>
              <strong>Contact Number:</strong> {'contact_number' in application ? application.contact_number : 'N/A'}
            </div>
            <div>
              <strong>Message:</strong> {application.message}
            </div>
          </div>
        );
      case 'corporate_forms':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>Name:</strong> {application.name}
            </div>
            {'nameof_company' in application && (
              <div>
                <strong>Name of Company:</strong> {'nameof_company' in application ? application.nameof_company : 'N/A'}
              </div>
            )}
            {'company_email' in application && (
              <div>
                <strong>Company Email:</strong> {application.company_email}
              </div>
            )}
            <div>
              <strong>Contact Number:</strong> {'contact_number' in application ? application.contact_number : 'N/A'}
            </div>
            <div>
              <strong>Message:</strong> {application.message}
            </div>
          </div>
        );
      case 'advertisement_forms':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>Name:</strong> {application.name}
            </div>
            <div>
              {'nameof_company' in application && (
                <div>
                  <strong>Name of Company:</strong> {'nameof_company' in application ? application.nameof_company : 'N/A'}
                </div>
              )}
            </div>
            {'email' in application && (
              <div>
                <strong>Email:</strong> {application.email}
              </div>
            )}
            {'company_email' in application && (
              <div>
                <strong>Company Email:</strong> {application.company_email}
              </div>
            )}
            <div>
              <strong>Contact Number:</strong> {'contact_number' in application ? application.contact_number : 'N/A'}
            </div>
            <div>
              <strong>Message:</strong> {application.message}
            </div>
            <div>
              <strong>Advertisement Type:</strong> {'advertisement_type' in application ? application.advertisement_type : 'N/A'}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const handleForward = async () => {
    const body = {
      type,
      // idArray: [application.id],
    };

    console.log(body);

    const res = await fetch('/api/forward', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      onClose();
    }
  }

// const handleDelete = async () => {
//   const id = '_id' in application ? application._id : null;

//   if (!id) {
//     console.error("No valid _id found in application");
//     return;
//   }

//   try {
//     const res = await fetch(`${baseURL}/api/v1/career/delete/${id}`, {
//       method: "DELETE",
//       headers: {
//         Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NzBkYjA1NTA5ZDEyYTE2OTkzNTNlOSIsImVtYWlsIjoiZGV2b3BzQGV6cGVkYWwuaW4iLCJpYXQiOjE3NTI1ODA0ODksImV4cCI6MTc1MjU4NDA4OX0.3G_IaR5ulTOTY1IjXcPv8c5u4sEfODKmzY5cgaY5xdk`,
//       },
//     });

//     if (res.ok) {
//       console.log("Deleted successfully");
//       onClose(); // you can pass id here if needed
//     } else {
//       const err = await res.json();
//       console.error("Failed to delete:", err.message);
//     }
//   } catch (err) {
//     console.error("Error deleting application:", err);
//   }
// };


const handleDelete = async () => {
      const token = getToken();
    if (!token) return handleAuthError();
  const id = '_id' in application ? application._id : null;

  if (!id) {
    console.error("No valid _id found in application");
    return;
  }

  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;


  let endpoint = "";

  switch (type) {
    case "career_forms":
      endpoint = `${baseURL}/api/v1/career/delete/${id}`;
      break;
    case "residential_forms":
      endpoint = `${baseURL}/api/v1/residential-forms/delete/${id}`;
      break;
    case "corporate_forms":
      endpoint = `${baseURL}/api/v1/corporate-forms/delete/${id}`;
      break;
    case "advertisement_forms":
      endpoint = `${baseURL}/api/v1/contact/delete/${id}`;
      break;
    default:
      console.error("Delete not supported for this form type:", type);
      return;
  }

  try {
    const res = await fetch(endpoint, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const err = await res.json();
      console.error("Failed to delete:", err.message);
      return;
    }

    console.log("Deleted successfully");
    onClose(id); // Pass ID to remove from UI list
  } catch (err) {
    console.error("Error deleting application:", err);
  }
};


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Application Details</h2>
            <button onClick={() => onClose()} className="text-gray-500 hover:text-gray-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Details</h3>
            {renderDetails(type)}
          </div>

          <div className="flex justify-between">
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={handleForward}
            >
              Connect Forward to Zoho
            </button>
            <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
