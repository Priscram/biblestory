import React, { useState, useEffect, useMemo } from 'react'
import { Country, State, City } from 'country-state-city'

function AddressSelector({ onAddressChange, onCountryChange, onRegionChange, onCityChange }) {
  const [address, setAddress] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [selectedState, setSelectedState] = useState(null)
  const [selectedCity, setSelectedCity] = useState(null)

  // Get all countries
  const countries = useMemo(() => Country.getAllCountries(), [])

  // Get states for selected country
  const states = useMemo(() => {
    if (!selectedCountry) return []
    return State.getStatesOfCountry(selectedCountry.isoCode)
  }, [selectedCountry])

  // Get cities for selected state
  const cities = useMemo(() => {
    if (!selectedCountry || !selectedState) return []
    return City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode)
  }, [selectedCountry, selectedState])

  const handleAddressChange = (e) => {
    const newAddress = e.target.value
    setAddress(newAddress)
    onAddressChange && onAddressChange(newAddress)
  }

  const handleCountryChange = (e) => {
    const countryIsoCode = e.target.value
    const countryObj = countries.find(c => c.isoCode === countryIsoCode)
    setSelectedCountry(countryObj)
    setSelectedState(null) // Reset state when country changes
    setSelectedCity(null) // Reset city when country changes
    onCountryChange && onCountryChange(countryIsoCode)
  }

  const handleRegionChange = (e) => {
    const stateIsoCode = e.target.value
    const stateObj = states.find(s => s.isoCode === stateIsoCode)
    setSelectedState(stateObj)
    setSelectedCity(null) // Reset city when state changes
    onRegionChange && onRegionChange(stateIsoCode)
  }

  const handleCityChange = (e) => {
    const cityName = e.target.value
    const cityObj = cities.find(c => c.name === cityName)
    setSelectedCity(cityObj)
    onCityChange && onCityChange(cityName)
  }

  return (
    <div className="address-selector">
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Street Address</label>
        <input
          type="text"
          value={address}
          onChange={handleAddressChange}
          placeholder="123 Main St, Barangay, District"
          style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Country</label>
        <select
          value={selectedCountry?.isoCode || ''}
          onChange={handleCountryChange}
          style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
        >
          <option value="">Select Country</option>
          {countries.map(country => (
            <option key={country.isoCode} value={country.isoCode}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Region/State/Province</label>
        <select
          value={selectedState?.isoCode || ''}
          onChange={handleRegionChange}
          style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          disabled={!states.length}
        >
          <option value="">Select Region/State/Province</option>
          {states.map(state => (
            <option key={state.isoCode} value={state.isoCode}>
              {state.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>City</label>
        <select
          value={selectedCity?.name || ''}
          onChange={handleCityChange}
          style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          disabled={!cities.length}
        >
          <option value="">Select City</option>
          {cities.map(city => (
            <option key={city.name} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default AddressSelector