import { toast } from "react-toastify";

export const showToast = (message = "", type = 3) => {
  if (type === 1) {
    toast.success(message || "success");
  } else if (type === 2) {
    toast.error(message || "error");
  } else {
    toast.info(message || "Operation in progress...");
  }
};
