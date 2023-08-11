/**
 * @jest-environment jsdom
 */

import {screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
// import { Bills } from "../containers/Bills.js"
import store from "../app/Store.js"

import router from "../app/Router.js";
import Bills from "../containers/Bills.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
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

    test("should return formatted bills from the store", () => {
      // Initialisation de l'instance de Bills
      // document.getElementById('root')
      document.body.style.backgroundColor="#0E5AE5"
      const instance = new Bills({
        document: document,
        onNavigate: () => {},
        store: store,
        localStorage: {},
      });
  
      // Appel de la méthode getBills
      const result = instance.getBills();
      console.log(result)
      console.log(result.length)
      // Vérification des résultats
      expect(result).toHaveLength(bills.length);
      expect(result[0].date).not.toEqual(bills[0].date);
      expect(result[0].status).not.toEqual(bills[0].status);
    });
  })
})
