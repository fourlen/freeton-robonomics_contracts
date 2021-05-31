ERC20 standard is used for tokens manipulations. TON Blockchain's ExctraCurrency mechanism should be used instead, but it is unsupported presently.
TIP-3 is quite awkward and not developed enough.

Time periods is measured in unixtime, not blocks, because block.number could suddenly increase by significant value after two shards merged, also the protocol doesn't enforce some strict conditions on the (average) block creation time (it could be from 3 to 5 seconds according to docs).

Architectural changes w.r.t. Ethereum Robonomics contracts:
1. Liabilities are part of Lighthouse persistent state, not separate contracts
2. More complicated provider queuing logic, fines for not being online introduced
3. Factory is now Root; used only for creating Lighthouses and (as planned) minting XRTs on Lighthouses queries.
4. On-chain validator now is capable of more complex logic, not only telling if pubkey is valid off-chain validator.
5. Penalty for not completing the task is introduced for executor (it is a new parameter which must coincide in demand-offer matching)
6. Creating a demand customer (as well as executor creating an offer) has to sign isDemand field (which prevents demand-offer replacement attacks).
7. Users of Lighthouse (providers, customers, executors) must initially transfer some balance to the Lighthouse contract and only then perform any kind of operations (not just approving this spending for Lighthouse contract). It simplifies payment logic complicated by TON Blockchain asynchronous nature (of contracts interaction).

Global TODO: handle storage fees; one way is to just reserve some small balance and return change +- the difference between desired and actual balance

Known issues:
1. someone could spam root contract with create liability queries, thus leading to large storage fees of isLighthouse map or/and wasting good names of lighthouses with bad parametrs
Ways to fix: make some sort of auction on names (or use TonDNS mechanisms for it); increase create lighthouse price; don't store the whole map -- instead check Merkle-proofs of entries (too complicated with this language unfortunately)

2. someone could spam Lighthouse contract with refillBalance queries with incorrect token address, thus leading to large storage fees of pending queries map.
Ways to fix: hold some gram value of the message until the response actually is received; delete old entries from the map

3. someone could spam Lighthouse contract with refillBalance queries with very small (by actual market value) amount of tokens, thus leading to large storage fees of balances map.
Ways to fix: hold some gram value of the message until the balance is fully withdrawn; introduce some price for this query.

4. provider could spam Lighthouse contract with createLiability queries and never finalize these liabilities, thus leading to large storage fees of liabilityByHash map.
Ways to fix: forcibly delete expired liabilities, make the price of createLiability depend on the deadline time.
