import RootLayout from "./layout";
import { Button, ButtonGroup, Col, Container, Row, Spinner } from "react-bootstrap";

import { Component } from "react";
import { Contribution, ContributionResponse } from "@/models/contributions";
import ContributionItem from "@/components/ContributionsItem";

const ENDPOINT = "http://localhost:8000/contributions";
const PAGE_SIZE = 14;

interface HomeState {
  contributions: Contribution[];
  page: number;
  loading: boolean;
  hasMore: boolean;
}

export default class Home extends Component<{}, HomeState> {

  constructor(props: any) {
    super(props);
    this.state = {
      contributions: [],
      page: 1,
      loading: false,
      hasMore: true,
    };
  }

  componentDidMount() {
    this.getContributions();
  }

  getNextPage() {
    this.setState((prevState) => ({
      page: prevState.page + 1,
    }), () => {
      this.getContributions();
    });
  }

  getPrevPage() {
    this.setState((prevState) => ({
      page: Math.max(prevState.page - 1, 1),
    }), () => {
      this.getContributions();
    });
  }

  getContributions() {
    this.setState({ loading: true });
    const skip = (this.state.page - 1) * PAGE_SIZE;
    fetch(`${ENDPOINT}?skip=${skip}&limit=${PAGE_SIZE}`)
      .then((response) => response.json())
      .then((data: ContributionResponse) => {
        const hasMore = data.total > (this.state.page * PAGE_SIZE);
        this.setState({ contributions: data.contributions, hasMore });
      })
      .catch((error) => {
        console.error("Error fetching contributions:", error);
      }).finally(() => {
        this.setState({ loading: false });
      });
  }

  render() {
    return (
      <RootLayout>
        <Container>
          <h1>Contributions</h1>
          {this.state.loading ? <Spinner animation="border" /> : <>
            {this.state.contributions.length > 0 ? <Row>
              {this.state.contributions.map((item: any, index: number) => (
                <Col lg={4} md={6} >
                  <ContributionItem key={index} item={item} />
                </Col>))}
            </Row> : <p>No contributions</p>}
            <Row>
              <Col className="text-center">
                <Button disabled={this.state.page === 1} onClick={this.getPrevPage}>&lt; Previous</Button>
                {this.state.page}
                <Button disabled={!this.state.hasMore} onClick={this.getNextPage}>Next &gt;</Button>
              </Col>
            </Row>
          </>}
        </Container>
      </RootLayout>
    );
  }
}
