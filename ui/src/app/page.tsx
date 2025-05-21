"use client";
import { useEffect, useRef, useState } from "react";
import { Button, ButtonGroup, Card, Col, Container, Form, Row, Spinner } from "react-bootstrap";

import { Contribution, ContributionResponse } from "@/models/contributions";
import ContributionItem from "@/components/ContributionsItem";
import Footer from "@/components/Footer";
import { getContributions, PAGE_SIZE } from "@/services/api";

import RootLayout from "./layout";
import { ContributionOrder, ContributionOrderOptions, ContributionSearchOptions } from "./form-options";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const searchParams = useSearchParams();

  // Get the initial search type and query from the URL
  let initialSearchType = ContributionOrder.Title;
  let initialSearchQuery = "";
  ContributionSearchOptions.some(option => {
    if (searchParams.has(option)) {
      initialSearchType = option as ContributionOrder;
      initialSearchQuery = searchParams.get(option) as string;
      return true;
    }
  });

  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [page, setPage] = useState(searchParams.has("page") ? parseInt(searchParams.get("page") as string) : 1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [numPages, setNumPages] = useState(1);
  const [orderBy, setOrderBy] = useState((searchParams.get("order_by") as ContributionOrder) || ContributionOrder.Id);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [searchType, setSearchType] = useState<ContributionOrder>(initialSearchType);
  const scrollTopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    getContributions(page, orderBy, searchType, searchQuery)
      .then((data: ContributionResponse) => {
        setContributions(data.contributions);
        setHasMore(data.total > page * PAGE_SIZE);
        setNumPages(Math.ceil(data.total / PAGE_SIZE));
      })
      .catch(error => {
        console.error("Error fetching contributions:", error);
      })
      .finally(() => {
        scrollTopRef.current?.scrollIntoView({ behavior: "smooth" });
        setLoading(false);
      });
  }, [page, orderBy, searchQuery, searchType]);

  const getNextPage = () => setPage(prev => prev + 1);
  const getPrevPage = () => setPage(prev => Math.max(prev - 1, 1));

  const handleOrderByChange = (selectedOrder: ContributionOrder) => {
    setOrderBy(selectedOrder);
    setPage(1);
  };

  const handleSearchQueryChange = (searchQuery: string) => {
    setSearchQuery(searchQuery);
    setPage(1);
  };

  const handleSearchTypeChange = (searchType: ContributionOrder) => {
    setSearchType(searchType);
    setPage(1);
  };

  return (
    <RootLayout>
      <header className="masthead">
        <Container className="h-100">
          <Row>
            <Col>
              <h1 className="text-center" ref={scrollTopRef}>
                Contributions
              </h1>
              <Card>
                <Card.Body>
                  <Form>
                    <Row className="justify-content-end">
                      <Col lg={4} md={6}>
                        <Form.Group className="my-3">
                          <Form.Label>Search by</Form.Label>
                          <br />
                          {ContributionSearchOptions.map((option, index) => (
                            <Form.Check
                              inline
                              key={index}
                              value={option}
                              label={ContributionOrderOptions.get(option)}
                              type="radio"
                              checked={searchType === option}
                              onChange={e => handleSearchTypeChange(e.target.value as ContributionOrder)}
                            />
                          ))}
                        </Form.Group>
                      </Col>
                      <Col lg={4} md={6}>
                        <Form.Group className="my-3">
                          <Form.Label>Search</Form.Label>
                          <Form.Control
                            value={searchQuery}
                            onChange={e => handleSearchQueryChange(e.target.value)}
                          ></Form.Control>
                        </Form.Group>
                      </Col>
                      <Col lg={4} md={6}>
                        <Form.Group className="mt-3 my-md-3">
                          <Form.Label>Order by</Form.Label>
                          <Form.Select
                            value={orderBy}
                            onChange={e => handleOrderByChange(e.target.value as ContributionOrder)}
                          >
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
      <Container className="container-contributions">
        {loading ? (
          <div className="py-5 text-center">
            <Spinner animation="border" />
          </div>
        ) : (
          <>
            {contributions.length > 0 ? (
              <Row>
                {contributions.map((item: any, index: number) => (
                  <Col lg={4} md={6} className="contribution-item" key={index}>
                    <ContributionItem item={item} />
                  </Col>
                ))}
              </Row>
            ) : (
              <p className="text-center my-5">No contributions</p>
            )}

            <Row className="my-3">
              <Col className="text-center">
                <ButtonGroup>
                  <Button disabled={page === 1} onClick={getPrevPage}>
                    &#10094;
                  </Button>
                  {Array.from({ length: numPages }, (_, i) => (
                    <Button key={i} onClick={() => setPage(i + 1)} variant={page === i + 1 ? "success" : "primary"}>
                      {i + 1}
                    </Button>
                  ))}
                  <Button disabled={!hasMore} onClick={getNextPage}>
                    &#10095;
                  </Button>
                </ButtonGroup>
              </Col>
            </Row>
          </>
        )}
      </Container>
      <Footer />
    </RootLayout>
  );
}
