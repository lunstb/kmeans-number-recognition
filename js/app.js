const boxWidth = 15;

class Pixel extends React.Component {
  // Handles an event on the pixel
  changeValue = (e) => {
    // Changes if the mouse is pressed
    if(e.buttons === 1){
      this.props.callback(this.props.posX,this.props.posY,true);
    }
  }

  render(){
    const pixelColor = {
      width: '100%',
      height: '100%',
      background: `rgb(${this.props.red},${this.props.green},${this.props.blue}`
    }
    return (
      <div className= "box" onMouseDown={(e) => this.changeValue(e)} onMouseEnter={(e) => this.changeValue(e)}>
        <div style={pixelColor}>
        </div>
      </div>
      
    );
  }
}

class Coordinate extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      animationName: '',
      animationNum: 0
    }
    
  }

  componentDidMount(){
    this.dropInAnimation();
  }

  componentDidUpdate(prevProps) {    
    if (prevProps.posX !== this.props.posX || prevProps.posY !== this.props.posY) {
      this.moveAnimation(prevProps.posX,prevProps.posY);
    }
  }

  moveAnimation(prevX, prevY){
    let styleSheet = document.styleSheets[0];
    
    let animationName = `moveAnimation${this.state.animationNum}`;
    
    let keyframes =
    `@keyframes ${animationName} {
      from{
        left: ${prevX} + 'px';
        top: ${prevY} + 'px';
      }
      to{
        left: this.props.posX + 'px';
        top: this.props.posY + 'px';
      }
    }`;
 
    styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
    
    this.setState({
      animationName: animationName,
      animationNum: this.state.animationNum+1
    });
    //console.log(`should move from (${prevX},${prevY}) to (${this.props.posX},${this.props.posY})`);
  }

  dropInAnimation(){
    let styleSheet = document.styleSheets[0];
    
    let animationName = `dropInAnimation${this.state.animationNum}`;
    
    let keyframes =
    `@keyframes ${animationName} {
      from{
        width: 50px;
        height: 50px;
        box-shadow: 15px 15px 5px rgba(170, 170, 170, 0.288);
      }
      to{
        width:25px;
        height:25px;
        box-shadow: 3px 3px 5px rgba(119, 119, 119, 0.745);
      }
    }`;
 
    styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
    
    this.setState({
      animationName: animationName,
      animationNum: this.state.animationNum+1
    });
  }

  render(){
    
    const boxOffset = {
      // The 1.1 is fairly arbitrary. It seemed to work and probably is necessary due to borders in css.
      left: (this.props.posX*1.1) + 'px',
      top: (this.props.posY*1.1) + 'px',
      position: 'absolute'
      
    }
    const coordinate = {
      height: '25px',
      width: '25px',
      borderRadius: '50%',
      display: 'inline-block',
      backgroundColor: `rgb(${this.props.red}, ${this.props.green}, ${this.props.blue})`,
      boxShadow: '3px 3px 5px rgba(119, 119, 119, 0.745)',
      animationName: this.state.animationName,
      animationDuration: '2s',
      animationTimingFunction: 'ease-in',
      zIndex: '1'
    }

    return (
      <div style = {boxOffset}>
        <div style = {coordinate}>
        </div>
      </div>
      
    )
  }
}

const CoordinateRow = (props) => {
  return (
    <div>
      {props.coordinatesInRow.map( coordinate => 
        <Coordinate
          posX = {coordinate.posX}
          posY = {coordinate.posY}
          red = {coordinate.red}
          green = {coordinate.green}
          blue = {coordinate.blue}
          key = {coordinate.id.toString()}
        />)}
    </div>
  )
}

const RenderCoordinates = (props) => {
  if(props.renderCoordinates){
    return <div>{
        props.coordinates.map( (rowOfCoordinates,index) =>
          <CoordinateRow
            coordinatesInRow = {rowOfCoordinates}
            key = {index.toString()}
          />
        )
    }</div> 
  }else{
    return <div></div>
  }
}

const CoordinateMovementTable = (props) => {
  return (
    <div>
      <table>
        <tr>
          <th>Coordinate Number</th>
          <th>X Pos</th>
          <th>Y Pos</th>
        </tr>
        
        {console.log("nyeh?")}
        {props.coordinates.map( (coordinateRow,i) =>
          coordinateRow.map((coordinate,j) => {
            <tr>
              <td>{`Coordinate ${i*coordinateRow.length+j+1}`}</td>
              <td>{`${coordinate.posX}`}</td>
              <td>`${coordinate.posY}`</td>
            </tr>
          })
          
        )}
      </table>
    </div>
  );
}

const PixelRow = (props) => {
  return (
    <div className = "pixelRow">
      {props.pixelsInRow.map( pixel =>
        <Pixel
          posX = {pixel.posX}
          posY = {pixel.posY}
          red = {pixel.red}
          green = {pixel.green}
          blue = {pixel.blue}
          value = {pixel.value}
          callback = {props.callback}
          key = {pixel.id.toString()}
        />
      )}
    </div>
  );
}



class ResetButton extends React.Component{
  reset = () => {
    this.props.callback();
  }

  render(){
    return (
      <button className = "fancyButton" onMouseDown={() => this.reset()}>Reset</button>
    );
  }
}

class RunButton extends React.Component{
  run = () => {
    this.props.callback();
  }

  render(){
    return (
      <button className = "fancyButton" onMouseDown={() => this.run()}>Run</button>
    );
  }
}

class GameContainer extends React.Component{
  constructor() {
    super();
    const boardSize = 28;
    const buildPixels = [];
    const coordinateSize = 3;
    const buildCoordinates = [];
    for(let i = 0; i<boardSize; ++i){
      const row = [];
      for(let j = 0; j<boardSize; ++j){
        const newPixel = {
          posX:i,
          posY:j,
          value: false,
          red:204,
          green:204,
          blue:204,
          id: i*boardSize+j
        }
        row.push(newPixel);
      }
      buildPixels.push(row);
    }
    for(let i = 0; i<coordinateSize; ++i){
      const row = [];
      for(let j = 0; j<coordinateSize; ++j){
        const newCoordinate = {
          posX:boardSize/coordinateSize*(i+.5)*boxWidth,
          posY:boardSize/coordinateSize*(j+.5)*boxWidth,
          movX:0,
          movY:0,
          red:255/coordinateSize*i,
          green:255/coordinateSize*j,
          blue:255,
          id: i*coordinateSize + j
        }
        row.push(newCoordinate);
      }
      buildCoordinates.push(row);
    }
    this.state = {
      pixels: buildPixels,
      renderCoordinates: false,
      coordinates: buildCoordinates
    };
  }

  setPixelValue = (posX,posY,value) => {
    let buildPixels = this.state.pixels;
    buildPixels[posX][posY].value = value;
    buildPixels[posX][posY].red = 0;
    buildPixels[posX][posY].green = 0;
    buildPixels[posX][posY].blue = 0;
    this.setState({
      pixels:buildPixels
    });
  }

  resetValues = () => {
    let buildPixels = this.state.pixels;
    buildPixels.forEach((row) =>{
      row.forEach((element)=>{
        element.red = 204;
        element.green = 204;
        element.blue = 204;
        element.value = false;
      });
    });
    this.setState({
      pixels:buildPixels,
      renderCoordinates: false
    });
  }

  stepForward = () => {
    // A nice reference to the state variables
    const buildPixels = this.state.pixels;
    const buildCoordinates = this.state.coordinates;

    const coordinatesSize = buildCoordinates.length;

    // Create an array of objects connecting pixels to their nearby coordinates
    let coordinatesNearbyPixels = [];
    for(let i = 0; i<Math.pow(buildCoordinates.length,2); ++i){
      let coordinateObject = {
        name: i,
        pixels: []
      };
      coordinatesNearbyPixels.push(coordinateObject);
    }
    // Connect a pixel to the nearest coordinate and add it to the list
    buildPixels.forEach((pixelRow) => {
      pixelRow.forEach(pixel => {
        if(pixel.value === false){
          return;
        }
        let minDistance = -1;
        let minIndex = -1;
        let closestCoordinate;
        const pixelX = pixel.posX*boxWidth;
        let pixelY = pixel.posY*boxWidth;
        buildCoordinates.forEach((coordinateRow,indexX) => {
          coordinateRow.forEach((coordinate,indexY) => {
            const coordinateX = coordinate.posX;
            const coordinateY = coordinate.posY;
            
            let distance = Math.sqrt(Math.pow(coordinateX-pixelX,2)+Math.pow(coordinateY-pixelY,2));
            if(minDistance === -1 || distance < minDistance){
              closestCoordinate = coordinate;
              minDistance = distance;
              minIndex = indexX*coordinatesSize+indexY;
            }
          })
        });
        pixel.red = closestCoordinate.red;
        pixel.green = closestCoordinate.green;
        pixel.blue = closestCoordinate.blue;
        coordinatesNearbyPixels[minIndex].pixels.push(pixel);
      });
      
    });

    // For each coordinate, average out the nearby pixels
    buildCoordinates.forEach((coordinateRow,indexX) => {
      coordinateRow.forEach((coordinate,indexY) => {
        let averageX = 0;
        let averageY = 0;
        coordinatesNearbyPixels[indexX*coordinatesSize+indexY].pixels.forEach(pixel => {
          averageX += pixel.posX;
          averageY += pixel.posY;
        });
        // Set the goals of the coordinates
        if(averageX !== 0 || averageY !== 0){
          averageX /= coordinatesNearbyPixels[indexX*coordinatesSize+indexY].pixels.length/boxWidth;
          averageY /= coordinatesNearbyPixels[indexX*coordinatesSize+indexY].pixels.length/boxWidth;        
          buildCoordinates[indexX][indexY].posX = averageX;
          buildCoordinates[indexX][indexY].posY = averageY;
        }
      });
    });

    // Set state of the coordinates so that they move
    this.setState({
      coordinates: buildCoordinates,
      pixels: buildPixels
    });
  }

  runSimulation = () => {
    // Drop down and render the coordinates
    this.setState({
      renderCoordinates: true
    });
    setInterval(() => this.stepForward(),2500);
    
    
  }

  

  render(){
    return (
      <div>
        <div className="pixelGrid">
          {this.state.pixels.map( (rowOfPixels,index) =>
            <PixelRow
              pixelsInRow = {rowOfPixels}
              key = {index.toString()}
              callback = {this.setPixelValue}
            />
          )}
          <RenderCoordinates
            renderCoordinates = {this.state.renderCoordinates}
            coordinates = {this.state.coordinates}
          />
          <CoordinateMovementTable coordinates = {this.state.coordinates}/>
          <ResetButton callback = {this.resetValues}/>
          <RunButton callback = {this.runSimulation}/>
          
        </div>
      </div>
    );
  }
}


class App extends React.Component {
  render(){
    return (
      <div>
        <GameContainer/>
      </div>
    );
  }
}

ReactDOM.render(
  <App/>,
  document.getElementById('root')
)
