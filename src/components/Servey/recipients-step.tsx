"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { Search } from "lucide-react"
import { User } from "./types/survey"


interface RecipientsStepProps {
  users: User[]
  selectedUsers: string[]
  onUserSelectionChange: (userId: string, selected: boolean) => void
}

export const RecipientsStep: React.FC<RecipientsStepProps> = ({ users, selectedUsers, onUserSelectionChange }) => {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      filteredUsers.forEach((user) => {
        if (!selectedUsers.includes(user.id)) {
          onUserSelectionChange(user.id, true)
        }
      })
    } else {
      filteredUsers.forEach((user) => {
        if (selectedUsers.includes(user.id)) {
          onUserSelectionChange(user.id, false)
        }
      })
    }
  }

  const isAllSelected = useMemo(() => {
    return filteredUsers.length > 0 && filteredUsers.every((user) => selectedUsers.includes(user.id))
  }, [filteredUsers, selectedUsers])

  return (
    <div className="bg-white">
      <div className="mb-6 px-4 sm:px-0">
        <h3 className="text-lg font-medium text-[#4E53B1] mb-2">Select user from the list</h3>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search names, roles, department"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
            <span className="hidden sm:inline">Filter</span>
          </button>
        </div>
      </div>
      <div className="rounded-lg overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead className="border-b border-gray-300">
            <tr>
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-gray-300 text-[#4E53B1] focus:ring-indigo-500"
                />
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-900">ID</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-900">Name</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-900">Email</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-900">Phone</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-900">Department</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-900">Last login</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={(e) => onUserSelectionChange(user.id, e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">{user.id}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                      {user.name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{user.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{user.phone}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{user.department}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{user.lastLogin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
