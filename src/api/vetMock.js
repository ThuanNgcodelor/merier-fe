// Fake API for Vet Portal (no backend needed)

export async function getVetProfile() {
  return {
    id: 1,
    name: "Dr. Emily Carter",
    specialization: "Small Animals (Dogs & Cats)",
    clinic_address: "123 PetCare Street, New York",
    years_experience: 8,
    bio: "Passionate veterinarian specializing in preventive care and surgery. Loves educating pet owners about healthy living for their furry friends."
  };
}

export async function updateVetProfile(profile) {
  console.log("Updated Vet Profile:", profile);
  return { success: true };
}

export async function getVetAppointments() {
  return [
    { id: 1, petName: "Bella", owner: "John Doe", date: "2025-09-15", reason: "Vaccination" },
    { id: 2, petName: "Max", owner: "Sarah Lee", date: "2025-09-16", reason: "Checkup" },
    { id: 3, petName: "Luna", owner: "Michael Smith", date: "2025-09-17", reason: "Skin allergy" },
  ];
}

export async function getVetHealthRecords() {
  return [
    { id: 1, petName: "Bella", record: "Annual vaccination completed", date: "2025-01-10" },
    { id: 2, petName: "Max", record: "Neutered and vaccinated", date: "2025-02-20" },
    { id: 3, petName: "Luna", record: "Skin allergy treatment ongoing", date: "2025-03-15" },
  ];
}

export async function getVetArticles() {
  return [
    { id: 1, title: "5 Tips for Healthy Pets", date: "2025-09-01" },
    { id: 2, title: "How to Recognize Common Pet Illnesses", date: "2025-09-05" },
    { id: 3, title: "Nutrition Advice for Puppies", date: "2025-09-08" },
  ];
}
