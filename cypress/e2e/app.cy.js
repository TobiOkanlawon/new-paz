describe("Renders the public routes without requiring authentication", () => {
  it("should render the login route", () => {
    cy.visit("/login");

    cy.get("h1").contains("Login");
  });

  it("should render the register route", () => {
    cy.visit("/register");
    cy.get("h1").contains("Register");
  });

  it("should render the forgot-password route", () => {
    cy.visit("/forgot-password");
    cy.get("h1").contains("Forgot Password");
  });
});
