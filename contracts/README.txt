ERC20 standard is used for tokens manipulations. TON Blockchain's ExctraCurrency mechanism should be used instead, but it is unsupported presently.
TIP-3 is quite awkward and not developed enought.

Time periods is measured in unixtime, not blocks, because block.number could suddenly increase by significant value after two shards merged, also the protocol doesn't enforce some strict conditions on the (average) block creation time (it could be from 3 to 5 seconds according to docs).

Global TODO: deal with storage fees; One way is to just reserve some small balance and return change +- the difference between desired and actual balance

Known issues:
1. someone could spam root contract with create liability queries, thus leading to large storage fees of isLighthouse map or/and wasting good names of lighthouses with bad parametrs
Ways to fix: make some sort of auction on names (or use TonDNS mechanisms for it); increase create lighthouse price; don't store the whole map -- instead check Merkle-proofs of entries (too complicated with this language unfortunately)

2. someone could spam Lighthouse contract with refillBalance queries with incorrect token address, thus leading to large storage fees of pending queries map.
Ways to fix: hold some gram value of the message until the response actually is received; delete old entries from the map

3. someone could spam Lighthouse contract with refillBalance queries with very small (by actual market value) amount of tokens, thus leading to large storage fees of balances map.
Ways to fix: hold some gram value of the message until the balance is fully withdrawn; introduce some price for this query.

4. provider could spam Lighthouse contract with createLiability queries and never finalize these liabilities, thus leading to large storage fees of liabilityByHash map.
Ways to fix: forcibly delete expired liabilities, make the price of createLiability depend on the deadline time.
