import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axiosInstance from "../../BaseComponet/axiosInstance";
import { toast } from "react-toastify";

function CustomerUpdateContact({
  show,
  handleClose,
  contact, // existing contact data to edit
  onContactUpdated,
}) {
  const [form, setForm] = useState({
    name: "",
    position: "",
    email: "",
    phone: "",
  });

  // Pre-fill form when modal opens
  useEffect(() => {
    if (show && contact) {
      setForm({
        name: contact.name || "",
        position: contact.position || "",
        email: contact.email || "",
        phone: contact.phone || "",
      });
    } else if (!show) {
      // Clear form when modal closes
      setForm({
        name: "",
        position: "",
        email: "",
        phone: "",
      });
    }
  }, [show, contact]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Submit handler
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!contact) {
    toast.error("No contact selected for update");
    return;
  }

  if (!form.name.trim()) {
    toast.error("Name is required");
    return;
  }

  const payload = {
    id: contact.id,
    customerId: contact.customerId,
    name: form.name.trim(),
    email: form.email,
    phone: form.phone,
    position: form.position,
    status: contact.status === undefined ? false : contact.status,
  };

  try {
    const response = await axiosInstance.put(
      "/customer/updateContact",
      payload
    );
    toast.success("Contact updated successfully");

    if (onContactUpdated) {
      onContactUpdated(response.data);
    }

    handleClose();
  } catch (error) {
    toast.error("Failed to update contact");
    console.error("Update contact error:", error);
  }
};


  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Contact</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {/* Name */}
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>
              Name<span style={{ color: "red" }}>*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Position */}
          <Form.Group className="mb-3" controlId="position">
            <Form.Label>Position</Form.Label>
            <Form.Control
              type="text"
              name="position"
              value={form.position}
              onChange={handleChange}
            />
          </Form.Group>

          {/* Email */}
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
          </Form.Group>

          {/* Phone */}
          <Form.Group className="mb-3" controlId="phone">
            <Form.Label>
              Phone<span style={{ color: "red" }}>*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Footer Buttons */}
          <div className="d-flex justify-content-end">
            <Button
              variant="secondary"
              onClick={handleClose}
              style={{ marginRight: 10 }}
            >
              Close
            </Button>
            <Button variant="primary" type="submit">
              Update
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default CustomerUpdateContact;
