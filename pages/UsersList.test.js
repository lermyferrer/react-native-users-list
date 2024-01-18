import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import UsersList from "./UsersList";

jest.mock("react-native-elements", () => require("../react-native-elements.mock"));


describe("UsersList Component", () => {
  it("renders correctly", () => {
    const { getByPlaceholderText, getByText } = render(<UsersList />);

    expect(getByPlaceholderText("Ingrese usuario a buscar...")).toBeTruthy();
    expect(getByText("Buscar")).toBeTruthy();
  });

  it("fetches all users on mount", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue([{ id: 1, login: "user1" }]),
    });

    render(<UsersList />);

    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith("https://api.github.com/users"));

    global.fetch.mockClear();
  });

  it("fetches user on button press", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({ items: [{ id: 1, login: "user1" }] }),
    });

    const { getByPlaceholderText, getByText, getByTestId } = render(<UsersList />);

    fireEvent.changeText(getByPlaceholderText("Ingrese usuario a buscar..."), "user1");
    fireEvent.press(getByText("Buscar"));

    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith("https://api.github.com/search/users?q=user1")
    );

    expect(getByTestId("user-login")).toHaveTextContent("user1");

    global.fetch.mockClear();
  });
});
