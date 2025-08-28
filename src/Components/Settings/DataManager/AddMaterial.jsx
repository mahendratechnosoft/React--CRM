import React, { useEffect, useState } from "react";
import { Button, Form, ListGroup, Spinner, Card } from "react-bootstrap";
import { FaTrash, FaPen } from "react-icons/fa";
import { toast } from "react-toastify";
import axiosInstance from "../../../BaseComponet/axiosInstance";

const AddMaterial = () => {
  const [materialInput, setMaterialInput] = useState("");
  const [materialList, setMaterialList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/work/getAllMaterials");
      setMaterialList(res.data || []);
    } catch (error) {
      toast.error("Failed to load materials");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMaterial = async () => {
    const materialName = materialInput.trim();
    if (!materialName) return;

    if (
      materialList.some(
        (m) => m.materialName.toLowerCase() === materialName.toLowerCase()
      )
    ) {
      toast.info("This material already exists");
      return;
    }

    try {
      const res = await axiosInstance.post(`/work/addMaterial/${materialName}`);
      if (res.data) {
        setMaterialList([...materialList, res.data]);
        setMaterialInput("");
        toast.success("Material added successfully");
      }
    } catch (error) {
      if (error.response?.status === 409) {
        toast.warning("Material already exists in DB");
      } else {
        toast.error("Failed to add material");
      }
    }
  };

  const handleEditClick = (item) => {
    setMaterialInput(item.materialName);
    setEditId(item.materialId);
    setEditMode(true);
  };

  const handleUpdateMaterial = async () => {
    const updatedName = materialInput.trim();
    if (!updatedName) return;

    try {
      const res = await axiosInstance.put(`/work/updateMaterial/${editId}`, {
        materialName: updatedName,
      });

      if (res.data) {
        setMaterialList((prev) =>
          prev.map((item) =>
            item.materialId === editId
              ? { ...item, materialName: updatedName }
              : item
          )
        );
        toast.success("Material updated successfully");
        resetInput();
      }
    } catch (error) {
      toast.error("Failed to update material");
    }
  };

  const handleDelete = async (materialId) => {
    try {
      const res = await axiosInstance.delete(
        `/work/deleteMaterial/${materialId}`
      );
      if (res.status === 200) {
        setMaterialList((prev) =>
          prev.filter((item) => item.materialId !== materialId)
        );
        toast.success("Material deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete material");
    }
  };

  const resetInput = () => {
    setMaterialInput("");
    setEditMode(false);
    setEditId(null);
  };

  return (
    <Card className="p-3 shadow-sm">
      <h5 className="mb-3">Manage Materials</h5>

      {/* Input Form */}
      <Form
        className="d-flex mb-3"
        onSubmit={(e) => {
          e.preventDefault();
          editMode ? handleUpdateMaterial() : handleAddMaterial();
        }}
      >
        <Form.Control
          type="text"
          placeholder="Enter material"
          value={materialInput}
          onChange={(e) => setMaterialInput(e.target.value)}
          autoFocus
        />
        {editMode ? (
          <>
            <Button
              variant="warning"
              className="ms-2"
              onClick={handleUpdateMaterial}
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
            onClick={handleAddMaterial}
          >
            Add
          </Button>
        )}
      </Form>

      {/* ✅ Materials List */}
      <h6 className="mb-2">Materials List</h6>
      <div
        style={{
          maxHeight: "300px",
          overflowY: "auto",
          border: "1px solid #ddd",
          borderRadius: "5px",
        }}
      >
        {/* Header row */}
        <div className="d-flex justify-content-between fw-bold bg-light p-2 border-bottom">
          <span>Material Name</span>
          <span>Actions</span>
        </div>

        {loading ? (
          <div className="text-center p-3">
            <Spinner animation="border" size="sm" /> Loading...
          </div>
        ) : materialList.length > 0 ? (
          <ListGroup variant="flush">
            {materialList.map((item) => (
              <ListGroup.Item
                key={item.materialId}
                className="d-flex justify-content-between align-items-center"
              >
                {item.materialName}
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
                    onClick={() => handleDelete(item.materialId)}
                  >
                    <FaTrash />
                  </Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <div className="text-muted text-center p-3">
            No material added yet.
          </div>
        )}
      </div>
    </Card>
  );
};

export default AddMaterial;
