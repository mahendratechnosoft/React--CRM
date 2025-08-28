import React, { useEffect, useState } from "react";
import { Button, Form, ListGroup, Spinner, Card } from "react-bootstrap";
import { FaTrash, FaPen } from "react-icons/fa";
import { toast } from "react-toastify";
import axiosInstance from "../../../BaseComponet/axiosInstance";

const AddThickness = () => {
  const [thicknessInput, setThicknessInput] = useState("");
  const [thicknessList, setThicknessList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchExistingThicknesses();
  }, []);

  const fetchExistingThicknesses = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/work/getAllThicknesses");
      setThicknessList(res.data || []);
    } catch (error) {
      toast.error("Failed to load thicknesses");
    } finally {
      setLoading(false);
    }
  };

  const handleAddThickness = async () => {
    const thicknessName = thicknessInput.trim();
    if (!thicknessName) return;

    if (
      thicknessList.some(
        (t) => t.thicknessName.toLowerCase() === thicknessName.toLowerCase()
      )
    ) {
      toast.info("This thickness already exists");
      return;
    }

    try {
      const res = await axiosInstance.post(
        `/work/addThickness/${thicknessName}`
      );
      if (res.data) {
        setThicknessList([...thicknessList, res.data]);
        setThicknessInput("");
        toast.success("Thickness added successfully");
      }
    } catch (error) {
      if (error.response?.status === 409) {
        toast.warning("Thickness already exists in DB");
      } else {
        toast.error("Failed to add thickness");
      }
    }
  };

  const handleEditClick = (item) => {
    setThicknessInput(item.thicknessName);
    setEditId(item.thicknessId);
    setEditMode(true);
  };

  const handleUpdateThickness = async () => {
    const updatedName = thicknessInput.trim();
    if (!updatedName) return;

    try {
      const res = await axiosInstance.put(`/work/updateThickness/${editId}`, {
        thicknessName: updatedName,
      });

      if (res.data) {
        setThicknessList((prev) =>
          prev.map((item) =>
            item.thicknessId === editId
              ? { ...item, thicknessName: updatedName }
              : item
          )
        );
        toast.success("Thickness updated successfully");
        resetInput();
      }
    } catch (error) {
      toast.error("Failed to update thickness");
    }
  };

  const handleDelete = async (thicknessId) => {
    try {
      const res = await axiosInstance.delete(
        `/work/deleteThickness/${thicknessId}`
      );
      if (res.status === 200) {
        setThicknessList((prev) =>
          prev.filter((item) => item.thicknessId !== thicknessId)
        );
        toast.success("Thickness deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete thickness");
    }
  };

  const resetInput = () => {
    setThicknessInput("");
    setEditMode(false);
    setEditId(null);
  };

  return (
    <Card className="p-3 shadow-sm">
      <h5 className="mb-3">Manage Thickness</h5>

      {/* Input Form */}
      <Form
        className="d-flex mb-3"
        onSubmit={(e) => {
          e.preventDefault();
          editMode ? handleUpdateThickness() : handleAddThickness();
        }}
      >
        <Form.Control
          type="text"
          placeholder="Enter thickness"
          value={thicknessInput}
          onChange={(e) => setThicknessInput(e.target.value)}
          autoFocus
        />
        {editMode ? (
          <>
            <Button
              variant="warning"
              className="ms-2"
              onClick={handleUpdateThickness}
            >
              Update
            </Button>
            <Button variant="secondary" className="ms-2" onClick={resetInput}>
              Cancel
            </Button>
          </>
        ) : (
          <Button
            variant="success"
            className="ms-2"
            onClick={handleAddThickness}
          >
            Add
          </Button>
        )}
      </Form>

      {/* ✅ Thickness List */}
      <h6 className="mb-2">Thickness List</h6>
      <div
        style={{
          maxHeight: "300px",
          overflowY: "auto",
          border: "1px solid #ddd",
          borderRadius: "5px",
        }}
      >
        {/* Header Row */}
        <div className="d-flex justify-content-between fw-bold bg-light p-2 border-bottom">
          <span>Thickness</span>
          <span>Actions</span>
        </div>

        {loading ? (
          <div className="text-center p-3">
            <Spinner animation="border" size="sm" /> Loading...
          </div>
        ) : thicknessList.length > 0 ? (
          <ListGroup variant="flush">
            {thicknessList.map((item) => (
              <ListGroup.Item
                key={item.thicknessId}
                className="d-flex justify-content-between align-items-center"
              >
                {item.thicknessName}
                <div className="d-flex gap-2">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handleEditClick(item)}
                  >
                    <FaPen />
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(item.thicknessId)}
                  >
                    <FaTrash />
                  </Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <div className="text-muted text-center p-3">
            No thickness added yet.
          </div>
        )}
      </div>
    </Card>
  );
};

export default AddThickness;
