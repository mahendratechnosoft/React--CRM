import React, { useState } from 'react';
import { Button, Row, Col, Form, Collapse } from 'react-bootstrap';
import { FaPlusCircle, FaTrash, FaChevronUp, FaChevronDown } from 'react-icons/fa';

const ConsiderationItem = ({
  item,
  index,
  totalItems,
  onConsiderationChange,
  onRemoveConsideration,
  onAddDescription,
  onRemoveDescription,
}) => {
  // Each consideration item manages its own open/closed state
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="mb-3 p-3" style={{ border: '1px solid #eee', borderRadius: '8px' }}>
      {/* --- Clickable Header Row for Toggling --- */}
      <Row
        className="mb-2 align-items-center"
        onClick={() => setIsOpen(!isOpen)}
        style={{ cursor: 'pointer' }}
      >
        <Col>
          <Form.Group onClick={(e) => e.stopPropagation()}> {/* Prevent toggle when clicking input */}
            <Form.Label className="fw-bold">Title {index + 1}</Form.Label>
            <Form.Control
              type="text"
              placeholder="Consideration title (e.g., Payment Terms)"
              name="title"
              value={item.title}
              onChange={(e) => onConsiderationChange(index, null, e)}
            />
          </Form.Group>
        </Col>
        <Col xs="auto" className="d-flex align-items-end">
          <Button
            variant="danger"
            size="sm"
            onClick={(e) => {
              e.stopPropagation(); // Prevent toggling the collapse state
              onRemoveConsideration(index);
            }}
            disabled={totalItems <= 1}
            className="me-3"
          >
            <FaTrash />
          </Button>
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </Col>
      </Row>

      {/* --- Collapsible Body with Descriptions --- */}
      <Collapse in={isOpen}>
        <div>
          {item.descriptions.map((desc, descIndex) => (
            <Row key={descIndex} className="mb-2 align-items-center">
              <Col xs="auto" className="ps-4">
                <span className="fw-bold">{`•`}</span>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label className="d-none">Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={1}
                    placeholder="Description point"
                    name="description"
                    value={desc}
                    onChange={(e) => onConsiderationChange(index, descIndex, e)}
                  />
                </Form.Group>
              </Col>
              <Col xs="auto" className="d-flex gap-2">
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => onRemoveDescription(index, descIndex)}
                  disabled={item.descriptions.length <= 1}
                >
                  <FaTrash />
                </Button>
                {/* Show Add button only for the last description */}
                {descIndex === item.descriptions.length - 1 && (
                  <Button
                    variant="outline-success"
                    size="sm"
                    onClick={() => onAddDescription(index)}
                  >
                    <FaPlusCircle />
                  </Button>
                )}
              </Col>
            </Row>
          ))}
        </div>
      </Collapse>
    </div>
  );
};

export default ConsiderationItem;