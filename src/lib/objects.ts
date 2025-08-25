import { IImage } from "@/models/Images";
import { IVideo } from "@/models/Video";
import { IUser } from "@/models/User";
import { IPost } from "@/models/Content";
import { IProfile } from "@/models/ProfilePicture";

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
};

class DataObject {
  private async fetchData<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { method = "GET", body, headers = {} } = options;

    const response = await fetch(`/api/auth/${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Request failed");
    }

    return response.json();
  }

  async getImages(username?: string): Promise<IImage[]> {
    const params = username ? `?username=${username}` : '';
    return this.fetchData<IImage[]>(`show-image${params}`);
  }

  async saveImage(imageData: Omit<IImage, "_id" | "createdAt" | "updatedAt">): Promise<IImage> {
    return this.fetchData<IImage>("save-image", {
      method: "POST",
      body: imageData,
    });
  }

  async getVideos(username?: string): Promise<IVideo[]> {
    const params = username ? `?username=${username}` : '';
    return this.fetchData<IVideo[]>(`save-videos${params}`);
  }

  async getUserByUsername(username: string) {
    return this.fetchData<IUser>(`users?username=${username}`);
  }

  async savePost(content: IPost): Promise<IPost> {
    return this.fetchData<IPost>('posts', {
      method: "POST",
      body: content,
    }
    )
  }

  async saveProfile(data: IProfile) {
    return this.fetchData<IProfile>('profileSettings', {
      method: 'POST',
      body: data
    })
  }

  async getProfilePicture(username?: string): Promise<IProfile | null> {
    return this.fetchData<IProfile>(`profileSettings?username=${username}`);
  }
}

export const DataModel = new DataObject();