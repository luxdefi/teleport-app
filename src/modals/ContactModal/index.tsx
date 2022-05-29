import React, { useState, useRef } from "react";
import { Close } from "@mui/icons-material";
import Modal from "../../components/Modal/MintModal";
import emailjs from "@emailjs/browser";

import User from "/public/icons/form-user.svg";
import Email from "/public/icons/form-email.svg";
import Phone from "/public/icons/form-phone.svg";
import Button from "components/Button";

interface ContactProps {
  isOpen: boolean;
  toggleContactModal: () => void;
}

const ContactModal = ({ isOpen, toggleContactModal }: ContactProps) => {
  const formRef = useRef();
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const sendEmail = (e: any) => {
    e.preventDefault();

    console.log("TARGET_", e.target);

    setLoading(true);
    emailjs
      .sendForm(
        "service_cvljqlf",
        "template_8dghnhe",
        formRef.current,
        "n6dlPJisIppC5kAl8"
      )
      .then(
        (result) => {
          setError("");
          setSuccess(
            "Thank you for your message, We will get back to you shortly."
          );
          setForm({ name: "", email: "", phone: "", message: "" });
          setLoading(false);
        },
        (error) => {
          setSuccess("");
          setError("Sorry, try again later");
          setLoading(false);
        }
      );
  };

  return (
    <Modal
      backgroundColor="transparent"
      isOpen={isOpen}
      onDismiss={toggleContactModal}
      maxWidth={400}
      isFullWidth={true}
      noPadding={true}
    >
      <div className={`flex justify-center items-center w-auto`}>
        <div className="w-full md:w-10/12 py-8 md:py-12 px-5 md:px-10 xl:w-2/3 bg-dark rounded-2xl h-[85vh] xl:h-auto overflow-y-auto">
          <div className="relative z-50">
            <div className="flex items-center ">
              <h1 className="font-work_sans font-bold text-white text-2xl md:text-5xl text-center flex-1">
                Get in touch
              </h1>
              <div
                className="flex items-center justify-center w-8 h-8 text-gray-500 bg-white rounded-full cursor-pointer primary ml-auto"
                onClick={toggleContactModal}
              >
                <Close />
              </div>
            </div>

            {error && <p className="text-red-400 text-center my-4">{error}</p>}
            {success && (
              <p className="text-green-400 text-center my-4">{success}</p>
            )}
            <form ref={formRef} onSubmit={sendEmail}>
              <div className="mt-8 md:mt-12 flex flex-col lg:flex-row gap-x-8">
                <div className="lg:w-1/2 space-y-6">
                  <Input
                    inputType="input"
                    name="name"
                    type="text"
                    label="Your Name"
                    imgSrc={User.src}
                    required
                    value={form.name}
                    onChange={(e: { target: { value: any } }) =>
                      setForm({ ...form, name: e.target.value })
                    }
                  />
                  <Input
                    inputType="input"
                    name="email"
                    type="email"
                    label="Your Email Address"
                    imgSrc={Email.src}
                    required
                    value={form.email}
                    onChange={(e: { target: { value: any } }) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                  <Input
                    inputType="input"
                    name="phone"
                    type="tel"
                    label="Your Phone Number"
                    imgSrc={Phone.src}
                    required={false}
                    value={form.phone}
                    onChange={(e: { target: { value: any } }) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                  />
                </div>
                <div className="flex-1 mt-8 lg:mt-0">
                  <Input
                    inputType="textarea"
                    name="message"
                    label="Message"
                    required
                    value={form.message}
                    onChange={(e: { target: { value: any } }) =>
                      setForm({ ...form, message: e.target.value })
                    }
                  />
                </div>
              </div>

              <Button loading={loading} className="mt-12 mx-auto lg:flex">
                <h1 className="font-work_sans font-medium text-white text-base xl:text-xl">
                  Send message
                </h1>
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ContactModal;

const Input = ({ value, onChange, inputType, imgSrc, ...props }: any) => {
  const Input = () => (
    <div>
      <label className="customInput__label">
        {props?.label}{" "}
        {props?.required ? (
          <span className="text-red-500">*</span>
        ) : (
          `(Optional)`
        )}
      </label>
      <div className="customInput_wrapper pl-3 md:pl-7 h-14 md:h-16">
        <img src={imgSrc} alt="Name" className="w-5 md:w-6" />
        <input
          type="text"
          id={props?.name}
          name={props?.name}
          value={props?.value}
          onChange={props?.onChange}
          {...props}
          className="customInput px-3 md:px-5"
        />
      </div>
    </div>
  );

  const Textarea = () => (
    <div>
      <label className="customInput__label">
        {props?.label}{" "}
        {props?.required ? (
          <span className="text-red-500">*</span>
        ) : (
          `(Optional)`
        )}
      </label>
      <div className="customInput_wrapper h-40 px-7 py-5 lg:h-80">
        <textarea
          id={props?.name}
          name={props?.name}
          value={props?.value}
          onChange={props?.onChange}
          {...props}
          placeholder="Your message"
          className="customInput"
        />
      </div>
    </div>
  );

  switch (inputType) {
    case "input":
      return <Input />;
    case "textarea":
      return <Textarea />;
    default:
      return <Input />;
  }
};
