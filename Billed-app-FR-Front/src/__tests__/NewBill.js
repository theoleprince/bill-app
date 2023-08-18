/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import "@testing-library/jest-dom";
import { ROUTES } from "../constants/routes";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store.js"
import userEvent from "@testing-library/user-event";

describe("Given I am connected as an employee", () => {
  let newBill;
  let mockOnNavigate;
  let bill;
  beforeAll(() => {
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    window.localStorage.setItem('user', JSON.stringify({ type: 'Employee' }));
    const html = NewBillUI()
    // mockOnNavigate = jest.fn();
    mockOnNavigate = (pathname) => { document.body.innerHTML = ROUTES({ pathname }) }
    document.body.innerHTML = html
    // Instanciez NewBill avec les mocks
    newBill = new NewBill({ document: document, onNavigate: mockOnNavigate, store: mockStore, localStorage: window.localStorage });
  })

  describe("Form Component", () => {

    test("renders all form fields", () => {
      const formElement = screen.getByTestId("form-new-bill");
      const expenseType = screen.getByTestId("expense-type");
      const expenseName = screen.getByTestId("expense-name");
      const datePicker = screen.getByTestId("datepicker");
      const amount = screen.getByTestId("amount");
      const vat = screen.getByTestId("vat");
      const pct = screen.getByTestId("pct");
      const commentary = screen.getByTestId("commentary");
      const file = screen.getByTestId("file");

      expect(formElement).toBeInTheDocument();
      expect(expenseType).toBeInTheDocument();
      expect(expenseName).toBeInTheDocument();
      expect(datePicker).toBeInTheDocument();
      expect(amount).toBeInTheDocument();
      expect(vat).toBeInTheDocument();
      expect(pct).toBeInTheDocument();
      expect(commentary).toBeInTheDocument();
      expect(file).toBeInTheDocument();
    });
  });

  describe('handleChangeFile', () => {
    // Test pour la fonction handleChangeFile
    test('should handle file change', () => {
       const fileChangeEvent = {
        preventDefault: jest.fn(),
        target: { value: "https://localhost:3456/images/test.jpg" },
      };
      const file = screen.getByTestId("file");
      const handleChangeFile1 = jest.fn((e) => newBill.handleChangeFile(fileChangeEvent))
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {}); // création un espion alertSpy pour surveiller les appels à la fonction window.alert
      file.addEventListener("change", handleChangeFile1)
      userEvent.upload(file, 'theo.png')
      expect(alertSpy).toHaveBeenCalledWith(
        "Invalid file extension. Only jpg, jpeg, and png files are allowed."
      );
      
    });
  });

  describe('handleSubmit', () => {
    // Test pour la fonction handleSubmit
    test('should handle form submit', () => {
      const submitEvent = {
        preventDefault: jest.fn(),
        target: {
          querySelector: jest.fn().mockImplementation((selector) => {
            switch (selector) {
              case 'input[data-testid="datepicker"]':
                return { value: "2021-12-01" };
              case 'select[data-testid="expense-type"]':
                return { value: "restaurant" };
              case 'input[data-testid="expense-name"]':
                return { value: "Test Restaurant" };
              case 'input[data-testid="amount"]':
                return { value: "100" };
              case 'input[data-testid="vat"]':
                return { value: "20" };
              case 'input[data-testid="pct"]':
                return { value: "10" };
              case 'textarea[data-testid="commentary"]':
                return { value: "Test commentary" };
              default:
                return null;
            }
          }),
        },
      };
      const submit = screen.getByTestId("submit");
      const submitEvent1 = jest.fn((e) => newBill.handleSubmit(submitEvent))
      submit.addEventListener("click", submitEvent1)
      userEvent.click(submit)
      expect(submitEvent1).toHaveBeenCalled()
      expect(submitEvent1).toBeTruthy();
    });
  });
})
