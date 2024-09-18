import { getAdviceIdWithSameContent } from ".";
import { adviceCollectionRef } from "../firebase";
import { query, where, getDocs, type QuerySnapshot } from "firebase/firestore";
import type { AdviceItem } from "../../utils/definitions";

vi.mock("firebase/firestore");

describe("getAdviceIdWithSameContent", () => {
  const mockAdviceItem: AdviceItem = { content: "some text content", id: 1 };

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("returns null if no advice with the same text content exists", async () => {
    const mockQuery = query(
      adviceCollectionRef,
      where("content", "==", mockAdviceItem.content)
    );
    vi.mocked(getDocs).mockResolvedValue({ empty: true } as QuerySnapshot);

    const result = await getAdviceIdWithSameContent(mockAdviceItem);

    expect(result).toBeNull();
    expect(getDocs).toHaveBeenCalledWith(mockQuery);
  });

  test("returns the id of the first advice with the same text content if it exists", async () => {
    const mockQuery = query(
      adviceCollectionRef,
      where("content", "==", mockAdviceItem.content)
    );
    const expectedId = 10;
    const mockDocData = { id: expectedId };
    const mockSnapshot = {
      empty: false,
      docs: [{ data: () => mockDocData }],
    };
    vi.mocked(getDocs).mockResolvedValue(
      mockSnapshot as unknown as QuerySnapshot
    );

    const result = await getAdviceIdWithSameContent(mockAdviceItem);

    expect(result).toBe(expectedId);
    expect(getDocs).toHaveBeenCalledWith(mockQuery);
  });
});
