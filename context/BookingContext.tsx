"use client"

import type React from "react"
import { createContext, useContext, useReducer, type ReactNode } from "react"

// Types
interface BookingAvailableAt {
  start_date: string
  end_date: string
}

interface Clinic {
  _id: string
  clinic_name?: string
  name?: string
  address?: string
  city?: string
  state?: string
  phone?: string
  email?: string
  clinic_contact_details?: {
    clinic_address?: string
    phone_numbers?: string[]
  }
  BookingAvailabeAt?: BookingAvailableAt
  isActive: boolean
}

// Updated PatientInfo interface to be more flexible
interface PatientInfo {
  name: string
  email: string
  phone: string
}

// Helper function to ensure PatientInfo has safe defaults
const createSafePatientInfo = (info: Partial<PatientInfo> = {}): PatientInfo => {
  return {
    name: info.name || "",
    email: info.email || "",
    phone: info.phone || ""
  
  }
}

interface BookingState {
  currentStep: number
  selectedClinic: Clinic | null
  selectedSessions: number
  selectedDate: string
  selectedTime: string
  patientInfo: PatientInfo
  sessionPrice: number
  sessionMRP: number
}

// Actions
type BookingAction =
  | { type: "SET_STEP"; payload: number }
  | { type: "SET_CLINIC"; payload: Clinic }
  | { type: "SET_SESSIONS"; payload: number }
  | { type: "SET_DATE"; payload: string }
  | { type: "SET_TIME"; payload: string }
  | { type: "SET_PATIENT_INFO"; payload: Partial<PatientInfo> }
  | { type: "SET_SESSION_PRICING"; payload: { price: number; mrp: number } }
  | { type: "RESET_BOOKING" }

// Initial state with safe defaults
const initialState: BookingState = {
  currentStep: 1,
  selectedClinic: null,
  selectedSessions: 1,
  selectedDate: "",
  selectedTime: "",
  patientInfo: createSafePatientInfo(),
  sessionPrice: 10000,
  sessionMRP: 12000,
}

// Enhanced reducer with validation
const bookingReducer = (state: BookingState, action: BookingAction): BookingState => {
  switch (action.type) {
    case "SET_STEP": {
      const step = typeof action.payload === "number" ? action.payload : state.currentStep
      return { ...state, currentStep: Math.max(1, Math.min(5, step)) }
    }

    case "SET_CLINIC": {
      if (!action.payload || typeof action.payload !== "object") {
        return state
      }
      return { ...state, selectedClinic: action.payload }
    }

    case "SET_SESSIONS": {
      const sessions = typeof action.payload === "number" ? action.payload : state.selectedSessions
      return { ...state, selectedSessions: Math.max(1, sessions) }
    }

    case "SET_DATE": {
      const date = typeof action.payload === "string" ? action.payload : ""
      return { ...state, selectedDate: date }
    }

    case "SET_TIME": {
      const time = typeof action.payload === "string" ? action.payload : ""
      return { ...state, selectedTime: time }
    }

    case "SET_PATIENT_INFO": {
      if (!action.payload || typeof action.payload !== "object") {
        return state
      }

      // Merge with existing patient info and ensure all fields are strings
      const updatedPatientInfo = createSafePatientInfo({
        ...state.patientInfo,
        ...action.payload,
      })

      return { ...state, patientInfo: updatedPatientInfo }
    }

    case "SET_SESSION_PRICING": {
      if (!action.payload || typeof action.payload !== "object") {
        return state
      }

      const price = typeof action.payload.price === "number" ? action.payload.price : state.sessionPrice
      const mrp = typeof action.payload.mrp === "number" ? action.payload.mrp : state.sessionMRP

      return {
        ...state,
        sessionPrice: Math.max(0, price),
        sessionMRP: Math.max(0, mrp),
      }
    }

    case "RESET_BOOKING":
      return { ...initialState }

    default:
      return state
  }
}

// Context
interface BookingContextType {
  state: BookingState
  dispatch: React.Dispatch<BookingAction>
  nextStep: () => void
  prevStep: () => void
  setClinic: (clinic: Clinic) => void
  setSessions: (sessions: number) => void
  setDateTime: (date: string, time: string) => void
  setPatientInfo: (info: Partial<PatientInfo>) => void
  updatePatientField: (field: keyof PatientInfo, value: string) => void
  resetBooking: () => void
  // Helper getters for safe access
  getPatientInfo: () => PatientInfo
  isPatientInfoValid: () => boolean
}

const BookingContext = createContext<BookingContextType | undefined>(undefined)

// Provider
interface BookingProviderProps {
  children: ReactNode
}

export const BookingProvider: React.FC<BookingProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(bookingReducer, initialState)

  const nextStep = () => {
    if (state.currentStep < 5) {
      dispatch({ type: "SET_STEP", payload: state.currentStep + 1 })
    }
  }

  const prevStep = () => {
    if (state.currentStep > 1) {
      dispatch({ type: "SET_STEP", payload: state.currentStep - 1 })
    }
  }

  const setClinic = (clinic: Clinic) => {
    if (clinic && typeof clinic === "object" && clinic._id) {
      dispatch({ type: "SET_CLINIC", payload: clinic })
    }
  }

  const setSessions = (sessions: number) => {
    if (typeof sessions === "number" && sessions > 0) {
      dispatch({ type: "SET_SESSIONS", payload: sessions })
    }
  }

  const setDateTime = (date: string, time: string) => {
    if (typeof date === "string") {
      dispatch({ type: "SET_DATE", payload: date })
    }
    if (typeof time === "string") {
      dispatch({ type: "SET_TIME", payload: time })
    }
  }

  const setPatientInfo = (info: Partial<PatientInfo>) => {
    if (info && typeof info === "object") {
      dispatch({ type: "SET_PATIENT_INFO", payload: info })
    }
  }

  // New helper function to update individual patient fields safely
  const updatePatientField = (field: keyof PatientInfo, value: string) => {
    if (typeof value === "string") {
      dispatch({
        type: "SET_PATIENT_INFO",
        payload: { [field]: value },
      })
    }
  }

  const resetBooking = () => {
    dispatch({ type: "RESET_BOOKING" })
  }

  // Helper getter to ensure safe access to patient info
  const getPatientInfo = (): PatientInfo => {
    return createSafePatientInfo(state.patientInfo)
  }

  // Helper to validate patient info
  const isPatientInfoValid = (): boolean => {
    const info = getPatientInfo()
    return !!(info.name?.trim() && info.email?.trim() && info.phone?.trim() && info.age?.trim() && info.gender?.trim())
  }

  const value: BookingContextType = {
    state: {
      ...state,
      patientInfo: getPatientInfo(), // Always return safe patient info
    },
    dispatch,
    nextStep,
    prevStep,
    setClinic,
    setSessions,
    setDateTime,
    setPatientInfo,
    updatePatientField,
    resetBooking,
    getPatientInfo,
    isPatientInfoValid,
  }

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}

// Enhanced hook with better error handling
export const useBooking = (): BookingContextType => {
  const context = useContext(BookingContext)

  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider")
  }

  return context
}

// Additional utility hooks for specific use cases
export const usePatientInfo = () => {
  const { state, setPatientInfo, updatePatientField, getPatientInfo, isPatientInfoValid } = useBooking()

  return {
    patientInfo: getPatientInfo(),
    setPatientInfo,
    updatePatientField,
    isValid: isPatientInfoValid(),
  }
}

export const useBookingStep = () => {
  const { state, nextStep, prevStep } = useBooking()

  return {
    currentStep: state.currentStep,
    nextStep,
    prevStep,
    canGoNext: state.currentStep < 5,
    canGoPrev: state.currentStep > 1,
  }
}
