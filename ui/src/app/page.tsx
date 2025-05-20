"use client"
import RootLayout from "./layout";
import { Button, Card, Col, Container, Form, Row, Spinner } from "react-bootstrap";
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
  const [orderBy, setOrderBy] = useState(ContributionOrder.Id);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    const skip = (page - 1) * PAGE_SIZE;
    fetch(`${ENDPOINT}?skip=${skip}&limit=${PAGE_SIZE}&order_by=${orderBy}`)
      .then((response) => response.json())
      .then((data: ContributionResponse) => {
        setContributions(data.contributions);
        setHasMore(data.total > (page * PAGE_SIZE));
      })
      .catch((error) => {
        console.error("Error fetching contributions:", error);
      })
      .finally(() => {
        containerRef.current?.scrollIntoView({ behavior: "smooth" });
        setLoading(false);
      });
  }, [page, orderBy]);

  const getNextPage = () => setPage((prev) => prev + 1);
  const getPrevPage = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleOrderByChange = (selectedOrder: ContributionOrder) => {
    console.log("Selected order:", selectedOrder);
    
    setOrderBy(selectedOrder);
    setPage(1); // Reset to first page when changing order
  };

  return (
    <RootLayout>
      <header className="masthead">
        <Container className="h-100">
          <Row >
            <Col>
              <h1 className="text-center">Contributions</h1>
              <Card>
                <Card.Body>
                  <Form>
                    <Row>
                      <Col md={4}></Col>
                      <Col lg={6} md={4}></Col>
                      <Col lg={2} md={4}>
                        <Form.Select aria-label="Order by" value={orderBy} onChange={(e) => handleOrderByChange(e.target.value as ContributionOrder)}>
                          {Array.from(ContributionOrderOptions.entries()).map(([key, value]) => (
                            <option key={key} value={key}>
                              {value}
                            </option>
                          ))}
                        </Form.Select>
                      </Col>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </header>
      <Container className="container-contributions" ref={containerRef}>

        {loading ? <Spinner animation="border" /> : <>
          {contributions.length > 0 ? <Row>
            {contributions.map((item: any, index: number) => (
              <Col lg={4} md={6} className="contribution-item" key={index}>
                <ContributionItem item={item} />
              </Col>
            ))}
          </Row> : <p className="m-auto">No contributions</p>}
          <Row className="my-3">
            <Col className="text-center">
              <Button disabled={page === 1} className="me-3" onClick={getPrevPage}>&#10094;</Button>
              {page}
              <Button disabled={!hasMore} className="ms-3" onClick={getNextPage}>&#10095;</Button>
            </Col>
          </Row>
        </>}
      </Container>
      <Footer />
    </RootLayout>
  );
}
