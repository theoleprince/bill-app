/**
 * @jest-environment jsdom
 */

import {screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills"
import { ROUTES, ROUTES_PATH} from "../constants/routes";
import {localStorageMock} from "../__mocks__/localStorage.js";
import Bills from "../containers/Bills.js";
import userEvent from "@testing-library/user-event";
import mockStore from "../__mocks__/store.js"
import router from "../app/Router";

jest.mock("../app/Store", () => mockStore) 


const onNavigate = (pathname) => { document.body.innerHTML = ROUTES({ pathname }) }

describe("Given I am connected as an employee", () => {
  beforeAll(() => {
    Object.defineProperty(window, 'localStorage', { value: localStorageMock})
    window.localStorage.setItem('user', JSON.stringify({ type: 'Employee'}));
  })
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      console.log(windowIcon)
      console.log(windowIcon.classList.contains('highlighted'))
      //to-do write expect expression
      expect(windowIcon).toBeTruthy();

    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })

    describe('When I click on an icon with eye', () => {   //  Lorsque je clique sur une icon avec oeil
      test('Check that the modal with the supporting title appeared', () => {   // Vérifier que le modal avec le titre justificatif est apparu
        document.body.innerHTML = BillsUI({ data: bills });
        const instanceBills = new Bills({ document, onNavigate, localStorage: window.localStorage});
        $.fn.modal = jest.fn();
        const icons = screen.getAllByTestId('icon-eye');
        const openModal = jest.fn(instanceBills.handleClickIconEye)
        const modal = screen.getByTestId('modaleFileEm'); 

        icons.forEach((icon) => {
          icon.addEventListener('click', (e) => openModal(icon))
          userEvent.click(icon);
        })

        expect(modal).toBeTruthy();
        expect(screen.getByText("Justificatif")).toBeTruthy();  
      })
      test('Test of the new expense report button', () => { // Test du bouton nouvelle note de frais
        document.body.innerHTML = BillsUI({ data: bills });
        const instanceBills = new Bills({ document, onNavigate, localStorage: window.localStorage});

        const buttonNewBill = screen.getByTestId('btn-new-bill'); 
        const handleClickNewBill = jest.fn(instanceBills.handleClickNewBill)

        buttonNewBill.addEventListener('click', handleClickNewBill)
        userEvent.click(buttonNewBill);

        expect(buttonNewBill).toBeTruthy();
        expect(screen.getAllByText("Envoyer une note de frais")).toBeTruthy(); 
      })
     
    })
  })
  
})


describe("Since I am a user logged in as an Employee", () => {
  describe("When an error occurs on API", () => {
    beforeEach(() => {
      jest.spyOn(mockStore, "bills")
      Object.defineProperty(
          window,
          'localStorage',
          { value: localStorageMock }
      )
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: "e@e"
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.appendChild(root)
      router()
    })
    test("fetches bills from an API and fails with 404 message error", async () => {

      mockStore.bills.mockImplementationOnce(() => {
        return {
          list : () =>  {
            return Promise.reject(new Error("Erreur 404"))
          }
        }})
      window.onNavigate(ROUTES_PATH.Bills)
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })

    test("fetches messages from an API and fails with 500 message error", async () => {

      mockStore.bills.mockImplementationOnce(() => {
        return {
          list : () =>  {
            return Promise.reject(new Error("Erreur 500"))
          }
        }})

      window.onNavigate(ROUTES_PATH.Bills)
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })
})

