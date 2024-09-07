import type { AdviceItem } from "../../utils/types";
import { addToAdviceCollection } from "./adviceCollection";
import { adviceCollectionRef } from "../firebase";
import { getAdviceIdWithSameContent } from "../utils/index";
import { addDoc } from "firebase/firestore";

vi.mock("../utils/index");
vi.mock("firebase/auth");
vi.mock("firebase/firestore");

const mockAdviceItem: AdviceItem = {
  content: "test",
  id: 0,
};
describe("addToAdviceCollection", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test(`returns passed in advice id, and adds advice to advice collection, 
    if no advice with the same text content exists`, async () => {
    vi.mocked(getAdviceIdWithSameContent).mockResolvedValue(null);

    const expectedId = 1;
    const adviceItem: AdviceItem = {
      content: "some text content",
      id: expectedId,
    };
    const id = await addToAdviceCollection(adviceItem);

    expect(id).toEqual(expectedId);
    expect(addDoc).toHaveBeenCalledWith(adviceCollectionRef, adviceItem);
  });

  test("returns advice id if advice with the same text content exists in firestore", async () => {
    const expectedId = 1;
    vi.mocked(getAdviceIdWithSameContent).mockResolvedValue(expectedId);

    const id = await addToAdviceCollection(mockAdviceItem);

    expect(id).toEqual(expectedId);
    expect(addDoc).toBeCalledTimes(0);
  });
  test("returns null and log error if an error occurs", async () => {
    vi.mocked(getAdviceIdWithSameContent).mockResolvedValue(null);
    vi.mocked(addDoc).mockImplementation(() => {
      throw new Error();
    });
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const id = await addToAdviceCollection(mockAdviceItem);

    expect(id).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Failed to add advice to advice collection\n",
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });
});
