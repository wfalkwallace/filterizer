const xmlHeader = (name, email, updated) => `<?xml version="1.0" encoding="utf-8" ?><feed xmlns:apps="http://schemas.google.com/apps/2006" xmlns="http://www.w3.org/2005/Atom"><title>Mail Filters</title><id>tag:mail.google.com,2008:filters:</id><updated>${updated}</updated><author><name>${name}</name><email>${email}</email></author>`;
const xmlFooter = "</feed>";
const getEntryXml = filterContent => `<entry><category term="filter"></category><title>Mail Filter</title><content></content>${filterContent}</entry>`;

// TODO: add shouldTrash, forwardTo, hasAttachment, shouldStar
const getNeverSpamXml = _ => '<apps:property name="shouldNeverSpam" value="true"></apps:property>';
const getMarkReadXml = _ => '<apps:property name="shouldMarkAsRead" value="true"></apps:property>';
const getShouldArchiveXml = _ => '<apps:property name="shouldArchive" value="true"></apps:property>';
const getLabelXml = label => `<apps:property name="label" value="${label}"></apps:property>`;
const getArchiveIndirectXml = me => `<apps:property name="doesNotHaveTheWord" value="${me}"></apps:property>`;
const getHasXml = value => `<apps:property name="hasTheWord" value="${value}"></apps:property>`;


const getHasPart = hasValue => {
  if (typeof hasValue === 'string') {
    return hasValue;
  } else if (hasValue.and) {
    debugger;
    return `(${hasValue.and.map(getHasPart).join(' AND ')})`;
  } else if (hasValue.or) {
    debugger;
    return `(${hasValue.or.map(getHasPart).join(' OR ')})`;
  }
};
const getHasRule = hasValue => getHasXml(getHasPart(hasValue));

const convert = (json) => {
  const name = 'William Falk-Wallace';
  const email = 'wfalkwallace@gmail.com';
  const date = new Date().toISOString();
  let xml = [xmlHeader(name, email, date)];

  const me = `(${json.me.join(' OR ')})`;
  const filters = json.filters;
  const filterXml = filters.reduce((xml, filter) => {
    let filterContent = [];
    if (filter.never_spam) filterContent.push(getNeverSpamXml());
    if (filter.mark_read) filterContent.push(getMarkReadXml());
    if (filter.has) filterContent.push(getHasRule(filter.has));
    if (filter.archive) filterContent.push(getShouldArchiveXml());
    if (filter.label) xml.push(getEntryXml(filterContent.concat(getLabelXml(filter.label)).join('')));
    if (filter.archive_unless_directed) xml.push(getEntryXml(filterContent.concat(getShouldArchiveXml(), getArchiveIndirectXml(me)).join('')));
    return xml;
  }, []);

  return xml.concat(filterXml, xmlFooter).join('');
};

module.exports = convert;
