import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axiosInstance from "../../BaseComponet/axiosInstance";
import { toast } from "react-toastify";

function CustomerCreateContact({
  show,
  handleClose,
  customerId,
  onContactCreated,
}) {
  const [form, setForm] = useState({
    profileImage: null,
    name: "",
    position: "",
    email: "",
    phone: "",
    primary: false,
  });

  // Reset form on modal open
  useEffect(() => {
    if (show) {
      setForm({
        profileImage: null,
        name: "",
        position: "",
        email: "",
        phone: "",
        primary: false,
      });
    }
  }, [show]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    setForm((prev) => ({
      ...prev,
      profileImage: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customerId) {
      toast.error("Customer ID is missing");
      return;
    }

    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }

    // Prepare payload according to API spec
    const payload = {
      customerId,
      name: form.name.trim(),
      email: form.email,
      phone: form.phone,
      position: form.position,
      // profileImage ignored as per API
    };

    try {
      const response = await axiosInstance.post(
        "/customer/createContact",
        payload
      );
      toast.success("Contact created successfully");

      if (onContactCreated) {
        onContactCreated(response.data);
      }

      handleClose();
    } catch (error) {
      toast.error("Failed to create contact");
      console.error("Create contact error:", error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add New Contact</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
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

          <Form.Group className="mb-3" controlId="position">
            <Form.Label>Position</Form.Label>
            <Form.Control
              type="text"
              name="position"
              value={form.position}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
          </Form.Group>

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

          <div className="d-flex justify-content-end">
            <Button
              variant="secondary"
              onClick={handleClose}
              style={{ marginRight: 10 }}
            >
              Close
            </Button>
            <Button variant="primary" type="submit">
              Save
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default CustomerCreateContact;
