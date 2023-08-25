/**
 * @jest-environment jsdom
 */

import { fireEvent, screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import "@testing-library/jest-dom";
import { ROUTES } from "../constants/routes";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store.js"
import userEvent from "@testing-library/user-event";
// jest.mock("../app/Store", () => mockStore)
describe("Given I am connected as an employee", () => {
  let newBill;
  let mockOnNavigate;
  beforeAll(() => {
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    window.localStorage.setItem('user', JSON.stringify({ type: 'Employee', email: "test@test.com" }));
    const html = NewBillUI()
    // // mockOnNavigate = jest.fn();
    mockOnNavigate = (pathname) => { document.body.innerHTML = ROUTES({ pathname }) }
    document.body.innerHTML = html

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
    // const newBill = new NewBill({ document: document, onNavigate: mockOnNavigate, store: mockStore, localStorage: window.localStorage });
    test('should handle file change', () => {
      const fileChangeEvent = {
        preventDefault: jest.fn(),
        target: { value: "https://localhost:3456/images/test.jpg" },
      };
      const file = screen.getByTestId("file");
      const handleChangeFile1 = jest.fn((e) => newBill.handleChangeFile(fileChangeEvent))
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => { }); // création un espion alertSpy pour surveiller les appels à la fonction window.alert
      file.addEventListener("change", handleChangeFile1)
      userEvent.upload(file, 'theo.png')
      expect(alertSpy).toHaveBeenCalledWith(
        "Invalid file extension. Only jpg, jpeg, and png files are allowed."
      );
    });
  });
});

describe('handleSubmit', () => {
  let newBill;
  let mockOnNavigate;
  beforeAll(() => {
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    window.localStorage.setItem('user', JSON.stringify({ type: 'Employee', email: "test@test.com" }));
    // const html = NewBillUI()
    // // mockOnNavigate = jest.fn();
    mockOnNavigate = (pathname) => { document.body.innerHTML = ROUTES({ pathname }) }
    document.body.innerHTML = NewBillUI()

    newBill = new NewBill({ document: document, onNavigate: mockOnNavigate, store: mockStore, localStorage: window.localStorage });
  })
  // Tester le formulaire avec les champs bien remplis
  describe('should handle form submit', () => {
    test('with the correct values', async () => {
      jest.spyOn(mockStore, 'bills');
      newBill.updateBill = jest.fn();

      const bill = {
        email: undefined,
        type: "Transports",
        name: "Vol Paris Londres",
        date: "2022-01-01",
        amount: 348,
        vat: "70",
        pct: 20,
        commentary: "Test commentary",
        fileUrl: "./theophane.png",
        fileName: "theophane.png",
        status: "pending",
      }

      const formElement = screen.getByTestId("form-new-bill");
      const expenseType = screen.getByTestId("expense-type");
      const expenseName = screen.getByTestId("expense-name");
      const datePicker = screen.getByTestId("datepicker");
      const amount = screen.getByTestId("amount");
      const vat = screen.getByTestId("vat");
      const pct = screen.getByTestId("pct");
      const commentary = screen.getByTestId("commentary");

      fireEvent.change(expenseType, { target: { value: bill.type } });
      fireEvent.change(expenseName, { target: { value: bill.name } });
      fireEvent.change(datePicker, { target: { value: bill.date } });
      fireEvent.change(amount, { target: { value: bill.amount } });
      fireEvent.change(vat, { target: { value: bill.vat } });
      fireEvent.change(pct, { target: { value: bill.pct } });
      fireEvent.change(commentary, { target: { value: bill.commentary } });
      newBill.fileName = bill.fileName;
      newBill.fileUrl = bill.fileUrl;

      const submit = screen.getByTestId("submit");
      const submitEvent1 = jest.fn((e) => newBill.handleSubmit(e))
      const mockStoreBills = mockStore.bills();
      formElement.addEventListener("submit", submitEvent1)
      userEvent.click(submit)

      expect(submitEvent1).toHaveBeenCalled();
      expect(newBill.updateBill).toHaveBeenCalled();
      expect(newBill.updateBill).toHaveBeenCalledWith(bill);
      expect(mockStoreBills).toBeTruthy();

      expect(screen.getByText('Mes notes de frais')).toBeTruthy();
    });

  })
  // Tester la fonction handleSubmit avec les champs partiellement remplis
  describe('Test the handleSubmit function', () => {
    test(' handleSubmit function failure', async () => {
      document.body.innerHTML = '';
      document.body.innerHTML = NewBillUI();
      newBill.updateBill = jest.fn();

      const formElement = screen.getByTestId("form-new-bill");

      fireEvent.submit(formElement)
      // Assert
      expect(newBill.updateBill).not.toHaveBeenCalled();
      expect(screen.getByText('Envoyer une note de frais')).toBeTruthy();

    });

  });
});
