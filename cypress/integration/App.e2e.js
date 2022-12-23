/* eslint-disable no-undef */
describe("App E2E", () => {
  it("should have a header", () => {
    cy.visit("/");

    cy.get(".navbar-brand").should("have.text", "Stock Market Dashboard");
  });

  it("should make selection in table row on click", () => {
    const desiredStock = "AAPL";

    cy.visit("/");

    cy.get(`#${desiredStock}-row`).click();
    cy.get("h2").should("have.text", desiredStock);
  });
});
