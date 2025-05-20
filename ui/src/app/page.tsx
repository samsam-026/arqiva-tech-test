"use client"
import RootLayout from "./layout";
import { Button, ButtonGroup, Card, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import { Contribution, ContributionResponse } from "@/models/contributions";
import ContributionItem from "@/components/ContributionsItem";
import Footer from "@/components/Footer";
import { ContributionOrder, ContributionOrderOptions } from "./form-options";

const ENDPOINT = "http://localhost:8000/contributions";
const PAGE_SIZE = 14;

export default function Home() {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [numPages, setNumPages] = useState(1);
  const [orderBy, setOrderBy] = useState(ContributionOrder.Id);
  const [title, setTitle] = useState('');
  const [owner, setOwner] = useState('');
  const [description, setDescription] = useState('');
  const scrollTopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    const skip = (page - 1) * PAGE_SIZE;
    let endpoint = `${ENDPOINT}?skip=${skip}&limit=${PAGE_SIZE}&order_by=${orderBy}`;
    if (title.length > 0) {
      endpoint += `&title=${title}`;
    }
    if (owner.length > 0) {
      endpoint += `&owner=${owner}`;
    }
    if (description.length > 0) {
      endpoint += `&description=${description}`;
    }
    if (title.length > 0 || owner.length > 0 || description.length > 0) {
      endpoint += `&match=all`;
    }
    fetch(endpoint)
      .then((response) => response.json())
      .then((data: ContributionResponse) => {
        setContributions(data.contributions);
        setHasMore(data.total > (page * PAGE_SIZE));
        setNumPages(Math.ceil(data.total / PAGE_SIZE));
      })
      .catch((error) => {
        console.error("Error fetching contributions:", error);
      })
      .finally(() => {
        scrollTopRef.current?.scrollIntoView({ behavior: "smooth" });
        setLoading(false);
      });
  }, [page, orderBy, title, owner, description]);

  const getNextPage = () => setPage((prev) => prev + 1);
  const getPrevPage = () => setPage((prev) => Math.max(prev - 1, 1));

  const handleOrderByChange = (selectedOrder: ContributionOrder) => {
    setOrderBy(selectedOrder);
    setPage(1); // Reset to first page when changing order
  };
  const handleTitleChange = (title: string) => {
    setTitle(title);
    setPage(1); // Reset to first page when changing title
  };
  const handleOwnerChange = (owner: string) => {
    setOwner(owner);
    setPage(1); // Reset to first page when changing owner
  };
  const handleDescriptionChange = (description: string) => {
    setDescription(description);
    setPage(1); // Reset to first page when changing description
  };

  return (
    <RootLayout>
      <header className="masthead">
        <Container className="h-100">
          <Row >
            <Col>
              <h1 className="text-center" ref={scrollTopRef}>Contributions</h1>
              <Card>
                <Card.Body>
                  <Form>
                    <Row>
                      <Col lg={3} md={4}>
                        <Form.Group className="mb-3 my-md-3">
                          <Form.Label>Title</Form.Label>
                          <Form.Control value={title} onChange={(e) => handleTitleChange(e.target.value)}></Form.Control>
                        </Form.Group>
                      </Col>
                      <Col lg={3} md={4}>
                        <Form.Group className="my-3">
                          <Form.Label>Owner</Form.Label>
                          <Form.Control value={owner} onChange={(e) => handleOwnerChange(e.target.value)}></Form.Control>
                        </Form.Group>
                      </Col>
                      <Col lg={3} md={4}>
                        <Form.Group className="my-3">
                          <Form.Label>Description</Form.Label>
                          <Form.Control value={description} onChange={(e) => handleDescriptionChange(e.target.value)}></Form.Control>
                        </Form.Group>
                      </Col>
                      <Col lg={3} md={4}>
                        <Form.Group className="mt-3 my-md-3">
                          <Form.Label>Order by</Form.Label>
                          <Form.Select value={orderBy} onChange={(e) => handleOrderByChange(e.target.value as ContributionOrder)}>
                            {Array.from(ContributionOrderOptions.entries()).map(([key, value]) => (
                              <option key={key} value={key}>
                                {value}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </header>
      <Container className="container-contributions" >
        {loading ? <div className="py-5 text-center"><Spinner animation="border" /></div> : <>
          {contributions.length > 0 ? <Row>
            {contributions.map((item: any, index: number) => (
              <Col lg={4} md={6} className="contribution-item" key={index}>
                <ContributionItem item={item} />
              </Col>
            ))}
          </Row> : <p className="text-center my-5">No contributions</p>}

          <Row className="my-3">
            <Col className="text-center">
              <ButtonGroup>
                <Button disabled={page === 1} onClick={getPrevPage}>&#10094;</Button>
                {Array.from({ length: numPages }, (_, i) => (
                  <Button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    variant={page === (i + 1) ? "success" : "primary"}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button disabled={!hasMore} onClick={getNextPage}>&#10095;</Button>
              </ButtonGroup>
            </Col>
          </Row>
        </>}
      </Container>
      <Footer />
    </RootLayout>
  );
}
