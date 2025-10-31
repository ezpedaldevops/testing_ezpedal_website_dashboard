

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
// API configuration and utility functions
const API_BASE_URL = `${baseURL}/api/v1/website-img`

  const getToken = () => localStorage.getItem("token");


// You should store this token securely, perhaps in environment variables or context


  const handleAuthError = () => {

    localStorage.removeItem("token");
 
  }


export interface ApiImage {
  _id: string
  section_name: string
  page_name: string
  image_identifier: string
  section_title: string
  cover_page: null
  media: {
    url: string
    contentType: string
    size: number
  }
}

export interface ApiResponse {
  success: boolean
  data: ApiImage[]
  cached: boolean
}

// Get gallery images
export const fetchGalleryImages = async (): Promise<ApiImage[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/images-list?page_name=gallery`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse = await response.json()

    if (result.success) {
      return result.data
    } else {
      throw new Error("API returned success: false")
    }
  } catch (error) {
    console.error("Error fetching gallery images:", error)
    throw error
  }
}

// Delete image by identifier
export const deleteImageByIdentifier = async (imageIdentifier: string): Promise<boolean> => {
      const token = getToken();
    if (!token) handleAuthError();
  try {
    const response = await fetch(`${API_BASE_URL}/delete-ui-image/${imageIdentifier}`, {
      method: "DELETE",
      headers: {
            Authorization: `Bearer ${token}`,
          },
    })

    return response.ok
  } catch (error) {
    console.error("Error deleting image:", error)
    return false
  }
}

// Delete section by section name
export const deleteSectionByName = async (sectionName: string): Promise<boolean> => {
  const token = getToken();
    if (!token) handleAuthError();
  try {
    const response = await fetch(`${API_BASE_URL}/delete-section/${sectionName}`, {
      method: "DELETE",
      headers: {
            Authorization: `Bearer ${token}`,
          },
    })

    return response.ok
  } catch (error) {
    console.error("Error deleting section:", error)
    return false
  }
}

// Upload image
export const uploadImage = async (
  pageName: string,
  sectionName: string,
  imageIdentifier: string,
  file: File,
): Promise<boolean> => {
  const token = getToken();
    if (!token) handleAuthError();
  try {
    const formData = new FormData()
    formData.append("page_name", pageName)
    formData.append("section_name", sectionName)
    formData.append("image_identifier", imageIdentifier)
    formData.append("file", file)

    const response = await fetch(`${API_BASE_URL}/upload-ui-image`, {
      method: "POST",
      headers: {
            Authorization: `Bearer ${token}`,
          },
      body: formData,
    })

    return response.ok
  } catch (error) {
    console.error("Error uploading image:", error)
    return false
  }
}
