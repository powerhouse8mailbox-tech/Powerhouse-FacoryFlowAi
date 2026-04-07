import asyncio
import logging
import random
from pymodbus.server import StartAsyncTcpServer
from pymodbus.device import ModbusDeviceIdentification
from pymodbus.datastore import ModbusSequentialDataBlock, ModbusSlaveContext, ModbusServerContext

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def update_data(context):
    """Update simulated PLC data periodically."""
    logger.info("Starting PLC simulation task...")
    slave_id = 0x00
    address = 0
    
    production_count = 0
    
    while True:
        # Simulate data
        status = random.choice([0, 1, 1, 1]) # Bias towards running
        temperature = int(random.uniform(35.0, 65.0) * 10) # Scaled by 10
        cycle_time = random.randint(25, 35)
        
        if status == 1:
            production_count += 1
            
        values = [status, temperature, cycle_time, production_count]
        
        # Write to Holding Registers (3)
        context[slave_id].setValues(3, address, values)
        
        logger.info(f"Updated PLC Data -> Status: {status}, Temp: {temperature/10.0}, Cycle: {cycle_time}, Count: {production_count}")
        await asyncio.sleep(2)

async def run_server():
    # Initialize data store
    # Address 0: Status (0=stopped, 1=running)
    # Address 1: Temperature (x10)
    # Address 2: Cycle Time
    # Address 3: Production Count
    store = ModbusSlaveContext(
        di=ModbusSequentialDataBlock(0, [0]*100),
        co=ModbusSequentialDataBlock(0, [0]*100),
        hr=ModbusSequentialDataBlock(0, [0]*100),
        ir=ModbusSequentialDataBlock(0, [0]*100))
    
    context = ModbusServerContext(slaves=store, single=True)
    
    identity = ModbusDeviceIdentification()
    identity.VendorName = 'FactorySim'
    identity.ProductCode = 'SIM-01'
    identity.VendorUrl = 'http://github.com/sim'
    identity.ProductName = 'PLC Simulator'
    identity.ModelName = 'Modbus TCP Node'
    identity.MajorMinorRevision = '1.0'

    # Start update task
    asyncio.create_task(update_data(context))
    
    # Start server
    logger.info("Starting Modbus TCP Server on 0.0.0.0:5020")
    await StartAsyncTcpServer(context, identity=identity, address=("0.0.0.0", 5020))

if __name__ == "__main__":
    asyncio.run(run_server())
