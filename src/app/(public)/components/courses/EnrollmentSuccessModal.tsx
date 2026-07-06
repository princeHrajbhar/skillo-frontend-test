import { CheckCircle } from "lucide-react";

interface EnrollmentSuccessModalProps {
  isOpen: boolean;
}

export default function EnrollmentSuccessModal({ isOpen }: EnrollmentSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div className="bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3">
        <CheckCircle className="h-6 w-6" />
        <div>
          <p className="font-semibold">Successfully Enrolled!</p>
          <p className="text-sm text-green-100">You can now start learning</p>
        </div>
      </div>
    </div>
  );
}