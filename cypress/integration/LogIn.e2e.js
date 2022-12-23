/* eslint-disable no-undef */
describe("LogIn E2E", () => {
  it("should have a header", () => {
    cy.visit("/log-in");

    cy.get("h2").should("have.text", "Log In");
  });

  it("should log in", () => {
    const correctEmail = "trader@example.com";
    const correctPassword = "abc123";

    cy.get("#submit").should("be.visible").should("be.disabled");
    cy.get("#email").should("be.visible").type(correctEmail);
    cy.get("#password").should("be.visible").type(correctPassword);
    cy.get("#submit").should("not.be.disabled").click();

    cy.get("h2").should("have.text", "Update Profile");
  });
});
