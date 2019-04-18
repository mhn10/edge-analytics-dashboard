import sys, os
import asyncio
import tattle
import argparse


async def run_node():
    await cluster.start()

    # join cluster
    if args.join is not None:
        await cluster.join(tattle.parse_address(args.join))

try:
    # parse arguments
    parser = argparse.ArgumentParser()
    parser.add_argument('--port', '-p', type=int, help="port on which the node will run")
    parser.add_argument('--join', '-j', type=str, required=False, metavar="NODE", help="address of node which we want to join")
    parser.add_argument('--debug', '-d', action='store_const', const=True, help="show debug outputs")
    args = parser.parse_args()

    # port = sys.argv[1] if len(sys.argv) > 1 else 7900
    # join = sys.argv[2] if len(sys.argv) > 2 else None

    config = tattle.Configuration(name='node-{}'.format(args.port), bind_port=args.port)
    # create node
    cluster = tattle.Cluster(config)

    # init logging
    log = tattle.logging.init_logger(level=tattle.logging.DEBUG if args.debug else tattle.logging.INFO)

    asyncio.get_event_loop().run_until_complete(run_node())
    asyncio.get_event_loop().run_forever()
except KeyboardInterrupt:
    try:
        sys.exit(0)
    except SystemExit:
        os._exit(0)
