let countyURL = './all-wilayas.json'
let educationURL = './csv.json'
let countyData
let educationData

let canvas = d3.select('#canvas')
let tooltip = d3.select('#tooltip')
// Move the fill attribute setting to a separate function
let setFillColor = (countyDataItem) => {
  
  let id = countyDataItem['properties']['id']
    let county = educationData.find((item) => {
      return item['fips'] === id
    })
    if (county && county['rate'] !== undefined) {
      let percentage = county['rate']
      if (percentage <= 1) {
        return '#ffffe5'
      } else if (percentage <= 2) {
        return ' #f8eadb '
      } else if (percentage <= 5) {
        return '#e5f8dd'
      } else {
        return '#ff0000 '
      }
    } else {
      // Handle the case where rate is undefined or county is not found
      return 'gray' // Or any other default color
  }
  
  }



let drawMap = () => {

  canvas.selectAll('path')
    .data(countyData)
    .enter()
    .append('path')
    .attr('d', d3.geoPath())
    .attr('class', 'county')
    .attr('fill', setFillColor)
    .attr('stroke', '#afcfeb') // Add red stroke
    .attr('stroke-width', "1px")
    .attr('data-fips', (countyDataItem) => {
      return countyDataItem['properties']['id']
    })
    .attr('data-education', (countyDataItem) => {
      let id = countyDataItem['properties']['id']
      let county = educationData.find((item) => {
        return item['fips'] === id
      })
      let percentage = county['rate']
      return percentage
    })
    .on('mouseover', (countyDataItem) => {
      tooltip.transition()
        .style('visibility', 'visible')

      let id = countyDataItem['properties']['id']
      let county = educationData.find((item) => {
        return item['fips'] === id
      })

      tooltip.text('\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0' + county['fips'] + ' - ' + county['city'] + '\n'
        + 'Population Percentage: ' + county['rate'] + '%');

    })
    .on('mouseout', (countyDataItem) => {
      tooltip.transition()
        .style('visibility', 'hidden')
    })
}



d3.json(countyURL).then(
  (data, error) => {
    if (error) {
      console.log(log)
    } else {
      countyData = topojson.feature(data, data.objects.county).features
      console.log(countyData)

      d3.json(educationURL).then(
        (data, error) => {
          if (error) {
            console.log(error)
          } else {
            educationData = data
            console.log(educationData)
            drawMap()
          }
        }
      )
    }
  }
)