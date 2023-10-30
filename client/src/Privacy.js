import { Container } from "react-bootstrap";

export default function PrivacyPolicy() {
  return (
    <>
      <p>No one likes to read a privacy policy with the length of a novella, so we will keep it
        brief and to the point.</p>

      <p>We process and store the data you submit, namely:</p>

      <ul>
        <li>your name (to be able to verify you are an educator and to group submissions from each person)</li>
        <li>experience (length of teaching activity and taught student groups)</li>
        <li>whether you will consider the perspective of teaching CS1 students</li>
        <li>your rating for each displayed and rated defect</li>
        <li>the order in which the defects were displayed to you</li>
        <li>the time when you made the action</li>
      </ul>

      <p>We may share the data you submit as a part of an academic research paper. If so,
        the name will be removed.</p>

      <p>The service is hosted in the EU and is provided by Anna Řechtáčková and her colleagues.
        Note that Cloudflare, Inc. is used as a proxy and may have access to the decrypted content while your
        data is in transit to us.</p>

      <p>We do not use cookies and only save data to localStorage if necessary for the website’s
        functionality.</p>

      <p>By filling in the information, you acknowledge that you grant consent to the
        processing and storage of your data as outlined above.</p>

      <p>You have the right to withdraw the consent, request retrieval, correction, or removal
        of your data. To exercise these rights or to send inquires,
        contact us at anna.rechtackova@mail.muni.cz.</p>

      <p>This version of the privacy policy was published on 2023-10-30 and relates to
        service provided on <a href="https://foo.com/">foo.com</a></p>
    </>
  );
}