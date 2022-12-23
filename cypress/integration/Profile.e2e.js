/* eslint-disable no-undef */
describe("Profile E2E", () => {
  it("should stay logged in after previous test", () => {
    cy.visit("/profile");
    cy.get("h2").should("have.text", "Update Profile");
    cy.url().should("include", "profile");
  });
  it("should update profile", () => {
    const newDisplayName = Math.floor(Math.random() * 1000 + 1).toString();
    const correctPassword = "abc123";
    cy.get("#submit-button").should("be.visible").should("be.disabled");
    cy.get("#displayName").should("be.visible").clear().type(newDisplayName);
    cy.get("#oldPassword").should("be.visible").type(correctPassword);
    cy.get("#submit-button").should("not.be.disabled").click();
    cy.get(".alert").should("have.text", "Changes to your profile were saved.");
    cy.reload();
    cy.get("#displayName")
      .should("be.visible")
      .should("have.value", newDisplayName);
  });
  it("should sign out", () => {
    cy.get("#sign-out").should("be.visible").click();
    cy.url().should("not.include", "profile");
  });
});
