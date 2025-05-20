"use client"
import RootLayout from "./layout";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import { Contribution, ContributionResponse } from "@/models/contributions";
import ContributionItem from "@/components/ContributionsItem";
import Footer from "@/components/Footer";

const ENDPOINT = "http://localhost:8000/contributions";
const PAGE_SIZE = 14;

export default function Home() {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    const skip = (page - 1) * PAGE_SIZE;
    fetch(`${ENDPOINT}?skip=${skip}&limit=${PAGE_SIZE}`)
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
  }, [page]);

  const getNextPage = () => setPage((prev) => prev + 1);
  const getPrevPage = () => setPage((prev) => Math.max(prev - 1, 1));

  return (
    <RootLayout>
      <header className="masthead">
        <Container className="h-100">
          <Row >
            <Col>
              <h1 className="text-center">Contributions</h1>
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
              <Button disabled={page === 1} className="me-3" onClick={getPrevPage}>&lt; Previous</Button>
              {page}
              <Button disabled={!hasMore} className="ms-3" onClick={getNextPage}>Next &gt;</Button>
            </Col>
          </Row>
        </>}
      </Container>
      <Footer />
    </RootLayout>
  );
}
