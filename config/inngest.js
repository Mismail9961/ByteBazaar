import User from "@/models/User";
import { Inngest } from "inngest";
import connectDB from "./db";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-next" });

export const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const userData = {
      _id: id,
      email: email_addresses?.[0]?.email_address ?? null,
      name: [first_name, last_name].filter(Boolean).join(" ") || "Unnamed User",
      image_url,
    };

    await connectDB();

    // Upsert instead of create to avoid duplicate errors
    await User.findOneAndUpdate({ _id: id }, { $set: userData }, { upsert: true, new: true });
  }
);

export const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const userData = {
      email: email_addresses?.[0]?.email_address ?? null,
      name: [first_name, last_name].filter(Boolean).join(" ") || "Unnamed User",
      image_url,
    };

    await connectDB();

    await User.findByIdAndUpdate(id, { $set: userData }, { new: true });
  }
);

export const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-with-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data;

    await connectDB();
    await User.findByIdAndDelete(id);
  }
);
