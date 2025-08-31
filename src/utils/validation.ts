import { ShiftAPIData } from "@/types/shift";

export  const validateShiftData = (apiData: ShiftAPIData): { isValid: boolean; message?: string } => {
    const { 
      currentUserId, 
      currentProjectId, 
      date, 
      shiftStatus, 
      startTime, 
      endTime, 
      shiftTitle, 
      job, 
      userIds, 
      location, 
      locationLng, 
      locationLat, 
      note 
    } = apiData;
    
    // Check currentUserId
    if (!currentUserId || currentUserId.trim() === "") {
      return {
        isValid: false,
        message: "Current User ID is required. Please select a user."
      };
    }
    
    // Check currentProjectId
    if (!currentProjectId || currentProjectId.trim() === "") {
      return {
        isValid: false,
        message: "Project ID is required."
      };
    }
    
    // Check date (ISO format)
    if (!date || date.trim() === "") {
      return {
        isValid: false,
        message: "Date is required. Please select a date."
      };
    }
    
    // Validate ISO date format
    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        return {
          isValid: false,
          message: "Invalid date format. Please select a valid date."
        };
      }
    } catch {
      return {
        isValid: false,
        message: "Invalid date format. Please select a valid date."
      };
    }
    
    // Check shiftStatus
    if (!shiftStatus || !["PUBLISHED", "DRAFT", "TEMPLATE"].includes(shiftStatus)) {
      return {
        isValid: false,
        message: "Valid shift status is required."
      };
    }
    
    // Check startTime
    if (!startTime || startTime.trim() === "") {
      return {
        isValid: false,
        message: "Start time is required. Please select a start time."
      };
    }
    
    // Validate startTime ISO format
    try {
      const startTimeObj = new Date(startTime);
      if (isNaN(startTimeObj.getTime())) {
        return {
          isValid: false,
          message: "Invalid start time format."
        };
      }
    } catch {
      return {
        isValid: false,
        message: "Invalid start time format."
      };
    }
    
    // Check endTime
    if (!endTime || endTime.trim() === "") {
      return {
        isValid: false,
        message: "End time is required. Please select an end time."
      };
    }
    
    // Validate endTime ISO format
    try {
      const endTimeObj = new Date(endTime);
      if (isNaN(endTimeObj.getTime())) {
        return {
          isValid: false,
          message: "Invalid end time format."
        };
      }
      
      // Check if end time is after start time
      const startTimeObj = new Date(startTime);
      if (endTimeObj <= startTimeObj) {
        return {
          isValid: false,
          message: "End time must be after start time."
        };
      }
    } catch {
      return {
        isValid: false,
        message: "Invalid end time format."
      };
    }
    
    // Check shiftTitle
    if (!shiftTitle || shiftTitle.trim() === "") {
      return {
        isValid: false,
        message: "Shift title is required. Please enter a shift title."
      };
    }
    
    // Check job
    if (!job || job.trim() === "") {
      return {
        isValid: false,
        message: "Job description is required. Please enter a job description."
      };
    }
    
    // Check userIds array
    if (!userIds || userIds.length === 0) {
      return {
        isValid: false,
        message: "At least one user must be assigned to the shift."
      };
    }
    
    // Validate each userId is not empty
    const invalidUserIds = userIds.filter(id => !id || id.trim() === "");
    if (invalidUserIds.length > 0) {
      return {
        isValid: false,
        message: "All user IDs must be valid. Please check the assigned users."
      };
    }
    
    // Check location
    if (!location || location.trim() === "") {
      return {
        isValid: false,
        message: "Location is required. Please enter or select a location."
      };
    }
    
    // Check locationLng (longitude cannot be 0)
    if (locationLng === 0) {
      return {
        isValid: false,
        message: "Please select a valid location. Longitude cannot be 0."
      };
    }
    
    // Check if locationLng is a valid number
    if (isNaN(locationLng)) {
      return {
        isValid: false,
        message: "Invalid longitude value. Please select a valid location."
      };
    }
    
    // Check locationLat (latitude cannot be 0)
    if (locationLat === 0) {
      return {
        isValid: false,
        message: "Please select a valid location. Latitude cannot be 0."
      };
    }
    
    // Check if locationLat is a valid number
    if (isNaN(locationLat)) {
      return {
        isValid: false,
        message: "Invalid latitude value. Please select a valid location."
      };
    }
    
    // Check note
    if (!note || note.trim() === "") {
      return {
        isValid: false,
        message: "Note/description is required. Please add a description for this shift."
      };
    }
    
    return { isValid: true };
  };