import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Logo from "@/assets/rasa_logo.png";
import { Calendar, Clock, FileText, Mail, User, Users, UtensilsCrossed } from "lucide-react";
import { PhoneInput } from "@/components/ui/phone-input";
import bookingImage from "@/assets/booking.png";
import bookingImage2 from "@/assets/reservation_image.png";
import { Input } from "@/components/ui/input";
import ReservationCompleteMassege from "@/components/ReservationCompleteMassege";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Booking() {
  const location = useLocation();
  const bookingData = location.state || {};
  const [visibleForm, setVisibleForm] = useState(false);
  const [completeReservation, setCompleteReservation] = useState(false);
  const [verificationError, setVerificationError] = useState("");
  const { pathname } = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    occasion: "",
    specialRequirements: "",
    tableNumber: bookingData.table,
    peopleCount: bookingData.people,
    date: bookingData.date,
    time: bookingData.time,
  });

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [sent, setSent] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  //send OTP
  const sendOtp = async () => {
    setError("");
    setLoading(true);
    setSent(false);
    try {
      const res = await axios.post("http://localhost:3200/api/booking/send", { phoneNumber });
      if (res.data.success) {
        toast.success("OTP Sent Successfully!", {
          style: {
            background: "#ffffff",
            color: "#464545",
          },
          progressStyle: {
            background: "#E39F00 !important",
          },
        });
        setTimeout(() => {
          setSent(true);
          setLoading(false);
        }, 4000);
        setOtpSent(true);
      } else {
        setError(res.data.message);
      }

      sent(true);
    } catch (error) {
      toast.success("Faild to send OTP", {
        style: {
          background: "#ffffff",
          color: "#464545",
        },
        progressStyle: {
          background: "#E39F00 !important",
        },
      });
      console.error(error);
    }
    setLoading(false);
  }

  //verify OTP
  const verifyOtp = async () => {
    setError("");
    try {
      const res = await axios.post("http://localhost:3200/api/booking/verify", {
        phoneNumber,
        verificationCode: otp,
      });
      if (res.data.success) {
        toast.success("OTP verified Successfully!", {
          style: {
            background: "#ffff",
            color: "#464545",
          },
          progressStyle: {
            background: "#E39F00",
          },
        });
        setTimeout(() => {
        setVisibleForm(true);
      }, 5000);
      } else {
        setError("Invalid or Expired OTP");
      }
    } catch (err) {
      console.log(err);
      setError("Invalid or expired OTP");
      setVerificationError(
        "Invalid verification code. Please try Check"
      );
    }
  }

  //create booking
  // const createBooking = async () => {
  //   try {
  //     const res = await axios.post("http://localhost:3200/api/booking", {
  //       phoneNumber,
  //       ...formData,
  //     });
  //     alert(res.data.message);
  //   } catch (err) {
  //     console.error(err);
  //     alert("Booking faild");
  //   }
  // };

  const createBooking = async () => {
    setBookingLoading(true);
    try {
      const res = await axios.post("http://localhost:3200/api/booking", {
        phoneNumber,
        ...formData,
      });

      if (res.data.success) {
        toast.success("Booking Created. waiting for accept", {
          style: {
            background: "#ffff",
            color: "#464545",
          },
          progressStyle: {
            background: "#E39F00",
          },
        });
        setVisibleForm(false);
        setCompleteReservation(true);
      }

      if (res.data.message) {
        toast.success("Booking Created Successfullly. Waiting to admin!", {
          style: {
            background: "#ffffff",
            color: "#464545",
          },
          progressStyle: {
            background: "#E39F00 !important",
          },
        });
      }
      setVisibleForm(false);
      setCompleteReservation(true);
    } catch (err) {
      console.error(err);
      alert("Booking failed!");
    }
    setBookingLoading(false);
  };


  console.log("Received bookingData:", bookingData);




  // const handleVerify = () => {
  //   // Simple verification example: code must be "1234"
  //   if (verificationCode.trim() === "1234") {
  //     setVerificationError("");
  //     setVisibleForm(true);
  //   } else {
  //     setVerificationError(
  //       "Invalid verification code. Please try 1234 for demo."
  //     );
  //     setVisibleForm(false);
  //   }
  // };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log("Reservation details submitted:", formData);
  // };

  // const handleReservation = () => {
  //   setVisibleForm(false);
  //   setCompleteReservation(true);
  // };

  return (
    <div className="mx-auto mt-4">
      {/*------------------------------------------------------------------------------------------------------------------------
      ------------------------------------------------- Main Content ------------------------------------------------------------
      ---------------------------------------------------------------------------------------------------------------------------*/}
      <div className="bg-white shadow-sm p-8 pb-10">
        {/*---------------------------------------------- Header ----------------------------------------------------------------*/}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            You're almost done!
          </h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/*----------------------------------------------------------------------------------------------------------------
          ------------------------------------- Left Column - Restaurant Info & Verification --------------------------------
          -------------------------------------------------------------------------------------------------------------------*/}
          <div className="space-y-6">

            {/* Restaurant Header */}
            <div className="flex items-end gap-4">
              <img src={Logo} alt="Raasa Restaurant Logo" />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">
                  Raasa Restaurant
                </h2>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <UtensilsCrossed className="w-4 h-4" />
                    <span>{bookingData.table || "Table"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{bookingData.date || "Date"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{bookingData.time || "Time"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{bookingData.people || "People"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3 bg-amber-100 p-2">
              <p className="text-sm text-gray-700 leading-relaxed">
                Lorem ipsum is simply dummy text of the printing and typesetting
                industry. Lorem ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took...
              </p>
            </div>

            {/* Details Section */}
            {!completeReservation && (
              <div className="flex flex-col gap-4">
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Details</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Lorem ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took...
                  </p>
                </div>

                {/* Phone input + Send (always visible) */}
                <div className="space-y-3">
                  <div className="flex gap-2 items-center">
                    <PhoneInput
                      value={phoneNumber}
                      onChange={(value) => setPhoneNumber(value)}
                      label="Phone Number"
                      placeholder="Enter your phone number"
                    />
                    <span
                      onClick={!loading ? sendOtp : null}
                      className={`font-semibold cursor-pointer 
                    ${loading || sent ? "text-gray-400" : "text-amber-500 hover:text-amber-600"}`}
                        ${loading ? "text-gray-400" : "text-amber-500 hover:text-amber-600"}`}
                    >
                      {loading ? "Sending..." : sent ? "Sent" : "Send"}
                    </span>

                  </div>
                  <p className="text-xs text-gray-500">
                    You will receive a text message to verify your account.
                    Message & data rates may apply
                  </p>
                </div>

                {/* Verification code + Verify button (only when not yet verified) */}
                {otpSent && !visibleForm && (
                  <>
                    <div className="flex gap-2 items-center">
                      <Input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter verification code"
                      />
                      <button
                        type="button"
                        onClick={verifyOtp}
                        className="bg-amber-500 hover:bg-amber-600 text-white py-1.5 px-4 rounded-md font-semibold cursor-pointer w-[200px]"
                      >
                        Verify
                      </button>
                    </div>
                    {verificationError && (
                      <p className="text-sm text-red-500 mt-1">
                        {verificationError}
                      </p>
                    )}
                  </>
                )}
              </div>
            )}

            {/*--------------------------------------------------------------------------------------------------------------------------------------------------------------
            -------------------------------------------------------- Reservation Details (visible after verification) -------------------------------------------------------
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------*/}
            {visibleForm && (
              <div className="max-w-2xl mx-auto">
                <h3 className="font-semibold text-gray-900 mt-2">
                  Reservation Details
                </h3>
                <div>
                  <input
                    placeholder="Name"
                    type="name"
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm mt-3"
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  /> <br />
                  <input
                    placeholder="Email"
                    type="email"
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm mt-3"
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  /> <br />
                  <select
                    name="occasion"
                    value={formData.occasion}
                    onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm mt-3 appearance-none"
                  >
                    <option value="">Select Occasion</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Anniversary">Anniversary</option>
                    <option value="Corporate Event">Corporate Event</option>
                    <option value="Other">Other</option>
                  </select>
                  <br />
                  <input
                    placeholder="Special Requirements"
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm mt-3"
                    onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                  /> <br />
                  <button
                    onClick={!bookingLoading ? createBooking : null}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 rounded-md transition cursor-pointer mt-5"
                  >
                    {bookingLoading ? "Booking..." : "Book Table"}
                  </button>
                  


                </div>

                <p className="text-xs text-muted-foreground mt-6 leading-relaxed">
                  Lorem ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an unknown
                  printer took
                </p>
              </div>
            )}

            {/*---------------------------------------------------------------------------------------------------------------------------------
            -------------------------------------------------- Reservation complitation form ---------------------------------------------------
            ------------------------------------------------------------------------------------------------------------------------------------*/}
            {completeReservation && (
              <ReservationCompleteMassege
                formData={formData}
                bookingData={bookingData}
              />
            )}
          </div>


          {/*--------------------------------------------------------------------------------------------------------------------------
          ----------------------------------------------------- Right Column - Food Image ---------------------------------------------
          -----------------------------------------------------------------------------------------------------------------------------*/}
          <div className="flex">
            <img
              src={visibleForm || completeReservation ? bookingImage2 : bookingImage}
              alt="Raasa Restaurant Dish"
              className={`w-full h-auto rounded-md object-cover ${visibleForm && "aspect-square"
                }`}
            />
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}