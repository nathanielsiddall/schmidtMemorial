#!/usr/bin/env node

const fs = require('fs')
const { DOMParser } = require('xmldom')
const parseSVG = require('svg-path-parser')

function convertSVGPathToCommands(d) {
  const parsed = parseSVG(d)
  let lastX = 0, lastY = 0
  return parsed.map(cmd => {
    let command = ''
    let newCmd = {}
    switch (cmd.code) {
      case 'M':
      case 'm':
        command = 'moveTo'
        newCmd.x = cmd.x
        newCmd.y = cmd.y
        break
      case 'L':
      case 'l':
        command = 'lineTo'
        newCmd.x = cmd.x
        newCmd.y = cmd.y
        break
      case 'H':
      case 'h':
        command = 'lineTo'
        // Use provided x and previous y
        newCmd.x = cmd.x
        newCmd.y = lastY
        break
      case 'V':
      case 'v':
        command = 'lineTo'
        // Use previous x and provided y
        newCmd.x = lastX
        newCmd.y = cmd.y
        break
      case 'Q':
      case 'q':
        command = 'quadraticCurveTo'
        newCmd.cpx = cmd.x1
        newCmd.cpy = cmd.y1
        newCmd.x = cmd.x
        newCmd.y = cmd.y
        break
      case 'C':
      case 'c':
        command = 'bezierCurveTo'
        newCmd.cp1x = cmd.x1
        newCmd.cp1y = cmd.y1
        newCmd.cp2x = cmd.x2
        newCmd.cp2y = cmd.y2
        newCmd.x = cmd.x
        newCmd.y = cmd.y
        break
      case 'Z':
      case 'z':
        command = 'closePath'
        break
      default:
        console.warn("Unhandled SVG command:", cmd.code)
    }
    if (newCmd.x !== undefined) lastX = newCmd.x
    if (newCmd.y !== undefined) lastY = newCmd.y
    return { command, ...newCmd }
  })
}

function main() {
  const args = process.argv.slice(2)
  if (args.length < 1) {
    console.error("Usage: node convert-svg.js <path-to-svg-file>")
    process.exit(1)
  }
  const svgFile = args[0]
  fs.readFile(svgFile, 'utf8', (err, data) => {
    if (err) {
      console.error("Error reading SVG file:", err)
      process.exit(1)
    }
    const parser = new DOMParser()
    const doc = parser.parseFromString(data, 'image/svg+xml')
    const pathElement = doc.getElementsByTagName('path')[0]
    if (!pathElement) {
      console.error("No <path> element found in SVG file.")
      process.exit(1)
    }
    const d = pathElement.getAttribute('d')
    if (!d) {
      console.error("No 'd' attribute found in the first <path> element.")
      process.exit(1)
    }
    const commands = convertSVGPathToCommands(d)
    console.log(JSON.stringify(commands, null, 2))
  })
}

main()
