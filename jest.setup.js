import '@testing-library/jest-dom'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// Mock Notification API
global.Notification = {
  requestPermission: jest.fn(() => Promise.resolve('granted')),
  permission: 'granted',
}

// Mock window.confirm
global.confirm = jest.fn(() => true)

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks()
  localStorage.clear()
})
