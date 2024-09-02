import { NonExistentUserError } from "../utils/errors";
import { getAuth, type Auth } from "firebase/auth";
import {
  type DocumentSnapshot,
  getDoc,
  type DocumentReference,
} from "firebase/firestore";
import type { AppUser } from "../utils/types";

vi.mock("firebase/auth");
vi.mock("firebase/firestore");

describe("getAppUser", () => {
  afterEach(() => {
    vi.resetModules();
  });
  test("throws NonExistentUserError if user has not been authenticated", async () => {
    const mockAuth = {
      currentUser: null,
    } as Auth;
    vi.mocked(getAuth).mockReturnValue(mockAuth as Auth);
    expect(getAuth()).toBe(mockAuth);

    const { getAppUser } = await import("./index");

    await expect(() => getAppUser()).rejects.toThrowError(NonExistentUserError);
  });

  test("returns null if the app user data does not exist", async () => {
    const mockAuth = {
      currentUser: {
        uid: "test",
      },
    } as Auth;
    vi.mocked(getAuth).mockReturnValue(mockAuth as Auth);
    expect(getAuth()).toBe(mockAuth);

    const mockSnapshot = {
      exists: () => false,
    } as DocumentSnapshot;
    vi.mocked(getDoc).mockResolvedValue(mockSnapshot);

    const { getAppUser } = await import("./index");

    expect(await getAppUser()).toBeNull();
  });

  test("returns the app user data if exists in db", async () => {
    const mockAuth = {
      currentUser: {
        uid: "test",
      },
    } as Auth;
    vi.mocked(getAuth).mockReturnValue(mockAuth as Auth);
    expect(getAuth()).toBe(mockAuth);

    const mockAppUser: AppUser = {
      name: "test",
      adviceIds: [],
    };
    const mockSnapshot = {
      exists: () => true,
      data: () => mockAppUser,
    } as unknown as DocumentSnapshot;
    vi.mocked(getDoc).mockResolvedValue(mockSnapshot);
    expect(await getDoc("ref" as unknown as DocumentReference)).toBe(
      mockSnapshot
    );

    const { getAppUser } = await import("./index");

    expect(await getAppUser()).toBe(mockAppUser);
  });
});
